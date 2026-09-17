<#
  build-hero-loop.ps1
  ------------------------------------------------------------------
  Builds the hero background loop:
      v2-web/assets/hero/hero-loop.mp4   (+ hero-poster.jpg)

  Pipeline:
      10 curated source windows  ->  normalized intermediates (near-lossless)
      -> xfade crossfades (0.8s) -> H.264 yuv420p / High / +faststart, no audio

  Design notes (do not regress):
      * Curated "best of" loop instead of the whole montage: keeps size small
        and avoids burnt-in subtitle cards and close-up faces.
      * Single H.264 MP4, no audio, faststart -> universal hardware decode,
        plays smoothly in Chrome/Edge/Safari, mobile included.
      * No drawtext / no font files -> nothing outside the repo is needed.
      * Ends on a warm water shot and starts on a warm water shot so the
        loop seam is gentle.

  The source montage lives in uploads/ (NOT tracked by git). Point -Src at it.

  Usage:
      powershell -ExecutionPolicy Bypass -File v2-web\tools\build-hero-loop.ps1
      powershell -ExecutionPolicy Bypass -File v2-web\tools\build-hero-loop.ps1 -Src "D:\path\clip.mp4"
#>
param(
  [string]$Src     = "",
  [string]$Ffmpeg  = "",
  [string]$Ffprobe = "",
  [string]$OutDir  = ""
)

$ErrorActionPreference = "Stop"
$inv = [System.Globalization.CultureInfo]::InvariantCulture
function F3([double]$v) { return $v.ToString('F3', $inv) }

# ---- resolve paths -------------------------------------------------------
$root = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
if (-not $OutDir) { $OutDir = Join-Path $root "v2-web\assets\hero" }
$tools = Join-Path $env:USERPROFILE ".deepworks\tools"
if (-not $Ffmpeg)  { $Ffmpeg  = Join-Path $tools "ffmpeg.exe" }
if (-not $Ffprobe) { $Ffprobe = Join-Path $tools "ffprobe.exe" }

# The raw montage is Chinese-named and lives in uploads/ (gitignored).
# Auto-pick the largest .mp4 there unless -Src is given.
if (-not $Src) {
  $upDir = Join-Path $root "uploads"
  $cand = Get-ChildItem -LiteralPath $upDir -Recurse -Filter "*.mp4" -ErrorAction SilentlyContinue |
          Sort-Object Length -Descending | Select-Object -First 1
  if ($cand) { $Src = $cand.FullName }
}

if (-not (Test-Path -LiteralPath $Ffmpeg)) { throw "ffmpeg not found: $Ffmpeg (pass -Ffmpeg)" }
if (-not $Src -or -not (Test-Path -LiteralPath $Src)) {
  throw "source video not found. Put the montage under uploads/ or pass -Src <path>."
}

# ---- edit decision list: (start seconds, duration seconds) ----------------
# All windows are clean landscape shots: no burnt-in text, no close-up faces.
$edl = @(
  14.0,  9.0,    # salt-lake mirror + wet-sand sunset reflection   (opener)
  23.0,  3.5,    # wind-farm golden sunset
  32.0,  4.0,    # seaside old town + city skyline
  37.0, 10.0,    # Hukou waterfall, Yellow River torrent
  48.0,  5.5,    # night fireworks / molten-iron sparks
  116.0, 6.0,    # Danxia waterfall + river gorge
  156.0, 6.0,    # night old-town lantern festival
  176.0, 6.0,    # tea-terrace spiral aerial
  188.0, 5.0,    # Hukou aerial + wind turbine at dusk
  131.0, 7.0     # ocean sunset mirror                          (closer -> loops to opener)
)
$fade = 0.8
$n = [int]($edl.Count / 2)

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$work = Join-Path $root ".deepworks\tmp\hero-loop-build"
New-Item -ItemType Directory -Force -Path $work | Out-Null
Get-ChildItem -Path $work -Filter "*.mp4" -ErrorAction SilentlyContinue | Remove-Item -Force

# ---- 1) extract normalized intermediates ---------------------------------
for ($i = 0; $i -lt $n; $i++) {
  $s = $edl[2 * $i]
  $t = $edl[2 * $i + 1]
  $out = Join-Path $work ("seg{0:D2}.mp4" -f $i)
  $a = @('-y','-hide_banner','-loglevel','error',
         '-ss', (F3 $s), '-t', (F3 $t), '-i', $Src,
         '-an','-vf','scale=854:480,fps=30,format=yuv420p',
         '-c:v','libx264','-preset','veryfast','-crf','16', $out)
  & $Ffmpeg @a
  if ($LASTEXITCODE -ne 0) { throw "extract failed for shot $i" }
  Write-Output ("shot {0:D2}  src={1}s  dur={2}s" -f $i, (F3 $s), (F3 $t))
}

# ---- 2) xfade chain -------------------------------------------------------
$chain = ""
$prev = "[0:v]"
$cum = $edl[1]
for ($k = 1; $k -lt $n; $k++) {
  $o = $cum - ($k * $fade)
  $outL = "[v$k]"
  $chain += "$prev[$($k):v]xfade=transition=fade:duration=$(F3 $fade):offset=$(F3 $o)$outL;"
  $prev = $outL
  $cum += $edl[2 * $k + 1]
}
$chain = $chain.TrimEnd(';')

$inputs = @()
for ($i = 0; $i -lt $n; $i++) { $inputs += @('-i', (Join-Path $work ("seg{0:D2}.mp4" -f $i))) }

$loopOut = Join-Path $OutDir "hero-loop.mp4"
$a = @('-y','-hide_banner','-loglevel','error') + $inputs + @(
  '-filter_complex', $chain, '-map', $prev,
  '-an','-c:v','libx264','-preset','slow','-crf','27','-pix_fmt','yuv420p',
  '-profile:v','high','-level','4.0','-g','60','-movflags','+faststart',
  $loopOut)
& $Ffmpeg @a
if ($LASTEXITCODE -ne 0) { throw "xfade / encode failed" }

# ---- 3) poster frame ------------------------------------------------------
$poster = Join-Path $OutDir "hero-poster.jpg"
& $Ffmpeg -y -hide_banner -loglevel error -ss 2.0 -i $loopOut -frames:v 1 $poster

$dur = $cum - ($n - 1) * $fade
Write-Output ("LOOP OK  duration={0}s" -f (F3 $dur))
& $Ffprobe -v error -show_entries format=duration,bit_rate,size -of default=noprint_wrappers=1 $loopOut
Get-Item $loopOut, $poster | Select-Object Name, Length
