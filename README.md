[![MIT License](https://badgen.net/badge/license/MIT)](https://opensource.org/licenses/MIT)
[![GitHub](https://badgen.net/github/release/appliedengdesign/vscode-gcode-syntax)](https://github.com/appliedengdesign/vscode-gcode-syntax)
[![GitHub Issues](https://badgen.net/github/open-issues/appliedengdesign/vscode-gcode-syntax)](https://github.com/appliedengdesign/vscode-gcode-syntax/issues)
![Gihub Stars](https://badgen.net/github/stars/appliedengdesign/vscode-gcode-syntax)
[![VS Marketplace Installs](https://badgen.net/vs-marketplace/i/appliedengdesign.vscode-gcode-syntax)](https://marketplace.visualstudio.com/items?itemName=appliedengdesign.vscode-gcode-syntax)
[![Follow @appliedengdesign](https://badgen.net/twitter/follow/appliedengdes)](https://twitter.com/appliedengdes)

<p align="center">
  <br />
  <img width="300" src="https://github.com/appliedengdesign/vscode-gcode-syntax/raw/master/images/logo.png" />
  <br /><br />
</p>

VSCode G-Code Syntax is the premier extension for editing G-Code inside of VSCode. Going past the simple syntax highlighting, this extension aims to turn your editor into a full blown g-code management suite. Building on the features of VSCode like Intellisense, snippets, debugging and more, we are able to offer nearly all of the features you would see in very expensive proprietary editors.

Additionally, by editing your G-Code inside of VSCode, you can take advantage of source control using Git to manage your g-code file versions.

![Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/screenshot.png)

>VSCode or [Visual Studio Code](https://code.visualstudio.com) is a FREE (as in beer), open source application for editing code of all kinds of programming languages. To make it even better, there is a great [marketplace](https://marketplace.visualstudio.com/VSCode) where you can download and add **extensions** to the application to support other languages, add features and more.

## Support VSCode-G-Code-Syntax

G-Code Syntax is generously offered to everyone free of charge, if you find it useful, please consider **supporting** the project by becoming a sponsor, sharing it, and letting your friends know!

Also, please [write a review](https://marketplace.visualstudio.com/items?itemName=appliedengdesign.vscode-gcode-syntax&ssr=false#review-details), [star me on GitHub](https://github.com/appliedengdesign/vscode-gcode-syntax 'Star me on GitHub'), and follow me on [Twitter](https://twitter.com/appliedengdes) or [Instagram](https://instagram.com/appliedengdes).

You can also subscribe to our videos over on [YouTube](https://youtube.com/c/AppliedEngDesignUSA).

## Features

This extension adds language syntax for CNC G-Code, code snippets, and colorization.

- Tree View
  - Tree View shows an overview of the operations in the G-Code Program
- Stats View
  - Stats View shows a number of stats like tool changes, runtime, etc.
- Status Bar messages about code status.

### Current Supported File Extensions

- .m
- .apt
- .nc
- .cnc
- .ncc
- .ecs
- .tap
- .fnc
- .ncg
- .gc
- .fan
- .fgc
- .din
- .xpi
- .hnc
- .ncp
- .min
- .gcd
- .rol
- .mpr
- .ply
- .out
- .eia
- .plt
- .sbp
- .mpf
- .gcode
- .g00
- .cls
- .dnc
- .knc
- .prg
- .001
- .ngc
- .ssb
- .sub
- .lib

If you would like another file extension supported by this extension, please [open an issue](https://github.com/appliedemgdesign/issues).

## Installation

Install from Extensions Marketplace or manually install the `vsix` file.

## Usage

Install & activate extension. Extension activates when you open a file marked for the `gcode` language.

Tree view is enabled by default and can be access from the G icon on the activity bar.

## G-Code Syntax Settings

G-Code Syntax is customizable and provides many configuration settings to allow the personalization of almost all features.

| Name                          | Description                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `gcode.general.machineType`   | **( Not Currently Active )**                                                                |
|                               |                                                                                             |
| `gcode.tree.autoRefresh`      | Tree auto-refreshes as changes are made to the g-code. ( Disabled by default )              |
|                               |                                                                                             |
| `gcode.stats.enable`          | Enable the statistics view. ( Disabled by default )                                         |
|                               |                                                                                             |
| `gcode.stats.autoRefresh`     | Auto-refresh the stats view when changes are made to the g-code. (Disabled by default)      |
|                               |                                                                                             |

![Settings Screenshot](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/images/settings-screenshot.png?raw=true)

## Known Issues

Please visit our [GitHub Issues](https://github.com/appliedengdesign/vscode-gcode-syntax/issues) page for any open issues.

## TODO

- Add more snippets
- Add additional tree items.
- More Statistics
- Additional status bar messages
- G-Code Debugging
- Backplotter
- Semantic Highlighting
- Programmatic Language Server

## Changelog

Latest Version: v0.4.1

Please refer to our [CHANGELOG](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CHANGELOG.md) doc.

## Contributing

If you work like to help contribute to the code or this project, please fork away and submit pull requests!

For more information on contributing, please refer to the [CONTRIBUTING](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CONTRIBUTING.md) doc.

## About Applied Eng & Design

We are a full service engineering and design firm, specializing in CAD/CAM, CNC milling, rapid prototyping, training and more.  We also like to dabble in Arudino / RaspberryPi projects, electronics, drones and robotics projects! Subscribe to our YouTube channel for videos on our projects, screencast tutorials, and more!

Follow us on [Twitter](https://twitter.com/appliedengdes) & [Instagram](https://instagram.com/appliedengdes), and like our [Facebook Page](https://facebook.com/appliedengdesign)!

## License

This extension is licensed under the [MIT License](https://opensource.org/licenses/MIT).
