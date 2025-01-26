/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import * as path from 'path';
import { extensions } from 'vscode';

const publisher = 'appliedengdesign';
const extensionId = 'vscode-gcode-syntax';
const extensionQualifiedId = `${publisher}.${extensionId}`;

const gcode = extensions.getExtension(extensionQualifiedId)!;

interface IConstants {
    readonly configId: string;
    readonly copyright: string;
    readonly extension: {
        readonly name: string;
        readonly version: string;
        readonly shortname: string;
    };
    readonly extensionOutputChannelName: string;
    readonly extensionQualifiedId: string;
    readonly gcodeIcon: string;
    readonly iconsPath: string;
    readonly iconExt: string;
    readonly jsonExt: string;
    readonly langId: string;
    readonly urls: {
        readonly changeLog: string;
        readonly readme: string;
        readonly vsmpReviews: string;
    };
}

export const constants: IConstants = {
    configId: gcode.packageJSON.contributes.languages[0].id,
    copyright: gcode.packageJSON.copyright,
    extension: {
        name: gcode.packageJSON.displayName,
        version: gcode.packageJSON.version,
        shortname: gcode.packageJSON.shortName,
    },
    extensionOutputChannelName: gcode.packageJSON.shortName,
    extensionQualifiedId: extensionQualifiedId,
    gcodeIcon: path.join(__dirname, '..', 'resources', 'icons', 'gcode.svg'),
    iconsPath: path.join(__dirname, '..', 'resources', 'icons'),
    iconExt: '.svg',
    jsonExt: '.cncc.json',
    langId: gcode.packageJSON.contributes.languages[0].id,
    urls: {
        changeLog: 'https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CHANGELOG.md',
        readme: 'https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/README.md',
        vsmpReviews:
            'https://marketplace.visualstudio.com/items?' +
            'itemName=appliedengdesign.vscode-gcode-syntax&ssr=false#review-details',
    },
} as const;

export enum PIcon {
    Alert = ' $(alert) ',
    Check = ' $(check) ',
    Heart = ' $(heart) ',
}

export enum VSBuiltInCommands {
    OpenSettings = 'workbench.action.openSettings',
    SetContext = 'setContext',
}

export enum Contexts {
    MachineType = 'gcode:general:machineType',
    ViewsNavTreeEnabled = 'gcode:views:navTree:enabled',
    ViewsStatsEnabled = 'gcode:views:stats:enabled',
    CalcWebviewViewEnabled = 'gcode:webviews:calc:enabled',
}

export enum GCodeUnits {
    Auto = 'Auto',
    Inch = 'Inch',
    MM = 'Metric',
    Default = 'Default (Inch)',
}

export enum GCommands {
    ShowGCodeSettings = 'gcode.showSettings',
    ShowSupportGCode = 'gcode.supportGCode',
    AddComment = 'gcode.addComment',
    RemoveComment = 'gcode.removeComment',
    AddLineNumbers = 'gcode.addLineNumbers',
    RemoveLineNumbers = 'gcode.removeLineNumbers',
}

export enum Webviews {
    CalcWebviewView = 'gcode.webviews.calc',
}

export enum WebviewTitles {
    CalcWebviewView = 'Machining Calculators',
}

export enum ViewCommands {
    RefreshStats = 'gcode.views.stats.refresh',
    RefreshTree = 'gcode.views.navTree.refresh',
    TreeSelect = 'gcode.views.navTree.select',
}

export enum WebviewCommands {
    ShowCodesWebview = 'gcode.webviews.codes.show',
    ShowCalcWebview = 'gcode.webviews.calc.show',
}
