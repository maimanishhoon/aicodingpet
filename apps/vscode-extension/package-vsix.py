import os
import zipfile
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
vsix_path = os.path.join(base_dir, "codepet-ai-0.1.0.vsix")

manifest_content = """<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011" xmlns:d="http://schemas.microsoft.com/developer/vsx-schema-design/2011">
\t<Metadata>
\t\t<Identity Language="en-US" Id="codepet-ai" Version="0.1.0" Publisher="codepet-local" />
\t\t<DisplayName>CodePet AI</DisplayName>
\t\t<Description xml:space="preserve">Professional 3D developer pet companion that scans all programming languages and helps correct errors with free AI models.</Description>
\t\t<Tags>ai,companion,pet,3d,python,javascript,typescript,swift,cpp,java</Tags>
\t\t<Categories>Programming Languages, Linters, Other</Categories>
\t\t<GalleryFlags>Public</GalleryFlags>
\t\t<Properties>
\t\t\t<Property Id="Microsoft.VisualStudio.Code.Engine" Value="^1.95.0" />
\t\t\t<Property Id="Microsoft.VisualStudio.Code.ExtensionDependencies" Value="" />
\t\t\t<Property Id="Microsoft.VisualStudio.Code.ExtensionPack" Value="" />
\t\t\t<Property Id="Microsoft.VisualStudio.Code.ExtensionKind" Value="workspace" />
\t\t\t<Property Id="Microsoft.VisualStudio.Code.LocalizedLanguages" Value="" />
\t\t\t<Property Id="Microsoft.VisualStudio.Code.EnabledApiProposals" Value="" />
\t\t\t<Property Id="Microsoft.VisualStudio.Code.ExecutesCode" Value="true" />
\t\t\t<Property Id="Microsoft.VisualStudio.Services.GitHubFlavoredMarkdown" Value="true" />
\t\t\t<Property Id="Microsoft.VisualStudio.Services.Content.Pricing" Value="Free"/>
\t\t</Properties>
\t</Metadata>
\t<Installation>
\t\t<InstallationTarget Id="Microsoft.VisualStudio.Code"/>
\t</Installation>
\t<Dependencies/>
\t<Assets>
\t\t<Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
\t</Assets>
</PackageManifest>"""

content_types = """<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension=".js" ContentType="application/javascript"/>
  <Default Extension=".json" ContentType="application/json"/>
  <Default Extension=".map" ContentType="application/json"/>
  <Default Extension=".ts" ContentType="video/mp2t"/>
  <Default Extension=".vsixmanifest" ContentType="text/xml"/>
</Types>"""

with zipfile.ZipFile(vsix_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("extension.vsixmanifest", manifest_content)
    z.writestr("[Content_Types].xml", content_types)

    # Add package.json
    pkg_path = os.path.join(base_dir, "package.json")
    if os.path.exists(pkg_path):
        z.write(pkg_path, "extension/package.json")

    # Add dist files
    dist_dir = os.path.join(base_dir, "dist")
    if os.path.exists(dist_dir):
        for fname in os.listdir(dist_dir):
            fpath = os.path.join(dist_dir, fname)
            if os.path.isfile(fpath):
                z.write(fpath, f"extension/dist/{fname}")

    # Add src files
    src_dir = os.path.join(base_dir, "src")
    if os.path.exists(src_dir):
        for fname in os.listdir(src_dir):
            fpath = os.path.join(src_dir, fname)
            if os.path.isfile(fpath):
                z.write(fpath, f"extension/src/{fname}")

print(f"Created fresh VSIX package: {vsix_path} ({os.path.getsize(vsix_path)} bytes)")
