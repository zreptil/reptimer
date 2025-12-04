param(
    [switch]$WhatIf
)

Get-ChildItem -Path . -Recurse -Filter "*.scss" -File | ForEach-Object {
    $old = $_.FullName
    $new = [System.IO.Path]::ChangeExtension($old, ".css")
    if ($WhatIf) {
        Write-Host "[DRY-RUN] Rename '$old' → '$new'"
    } else {
        Rename-Item -Path $old -NewName $new -Verbose
    }
}

Get-ChildItem -Path . -Recurse -Include *.ts -File | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $updated = $content -replace "\.component\.scss", ".component.css" `
                          -replace "\.scss(['""])", ".css`$1"
    if ($updated -ne $content) {
        if ($WhatIf) {
            Write-Host "[DRY-RUN] Update $_.FullName"
        } else {
            Set-Content $_.FullName $updated -Verbose
        }
    }
}

# Beispielhafte finale Zeile:
if ($WhatIf) {
    Write-Host "✅ Migration SCSS > CSS abgeschlossen (Test-Modus, keine Aenderungen gemacht)"
} else {
    Write-Host "✅ Migration SCSS > CSS abgeschlossen"
}

