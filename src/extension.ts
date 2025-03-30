/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { configuration } from './util/configuration/config';
import { constants } from './util/constants';
import { Logger } from './util/logger';
import { Control } from './control';

export function activate(context: ExtensionContext) {
    const start = process.hrtime();

    // Initialize Logger
    Logger.initialize(context);
    Logger.enable();

    Logger.log('Initializing G-Code...');

    // Initialize Controller
    Control.initialize(context, configuration);

    Logger.log(
        `${constants.extension.shortname} v${constants.extension.version} activated in ${Control.getLoadTime(
            start,
        ).toFixed(3)}ms`,
    );
    Logger.log(constants.copyright);

    // Linting Decorators:
    let activeEditor = vscode.window.activeTextEditor;
    let timeout: NodeJS.Timeout | undefined = undefined;
    const decorationType = vscode.window.createTextEditorDecorationType({
        // borderWidth: '1px',
        // borderStyle: 'solid',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        light: {
            // used in light color themes
            borderColor: 'darkblue',
            overviewRulerColor: 'darkblue',
            textDecoration: 'darkblue wavy underline',
        },
        dark: {
            // used in dark color themes
            borderColor: 'yellow',
            overviewRulerColor: 'yellow',
            textDecoration: 'yellow wavy underline',
        },
    });

    if (activeEditor) {
        triggerUpdateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(
        editor => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations();
            }
        },
        null,
        context.subscriptions,
    );

    vscode.workspace.onDidChangeTextDocument(
        event => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        },
        null,
        context.subscriptions,
    );

    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        timeout = setTimeout(updateDecorations, 500);
    }

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        const rangesToDecorate: vscode.DecorationOptions[] = [];
        check_todoComment(rangesToDecorate);
        check_gotoHasNumber(rangesToDecorate);
        check_gotoNumbers(rangesToDecorate);
        check_g23HaveRadius(rangesToDecorate);
        activeEditor.setDecorations(decorationType, rangesToDecorate);
    }

    function check_todoComment(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /\(.*(TODO|\*).*\)/g;
        const hoverMessage = 'To-do comment detected.';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function check_gotoHasNumber(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /(?<!\()\bGOTO[ \n\b\s]?[^\d ]\b(?![\)])/g;
        const hoverMessage = 'GOTO no target number given';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function check_g23HaveRadius(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /(G0?[23][^R]*(\(|$))/g;
        const hoverMessage = 'G2/3 Missing Radius';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function genericCheck(
        regex: RegExp = /^$/,
        hoverMessage: string = '',
        rangesToDecorate: vscode.DecorationOptions[] = [],
    ) {
        if (!activeEditor) {
            return;
        }
        const text = activeEditor.document.getText();
        const regexIdVariable = regex; // e.g. /if ?\(([^=)]*[iI][dD](?!\.)\b) ?[^=<>\r\n]*?\)/g;
        let match = regexIdVariable.exec(text);
        let firstLineNumber = null;
        while (match) {
            if (firstLineNumber == null) {
                firstLineNumber = activeEditor.document.positionAt(match.index).line + 1;
            }
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            const decoration = {
                range: new vscode.Range(startPos, endPos),
                hoverMessage: hoverMessage
                    .replace(/\$\{match\[1\]\}/g, match[1])
                    .replace(/\$\{match\[2\]\}/g, match[2]), // e.g. `An ID of 0 would evaluate to falsy. Consider: ${match[1]} != null`
            };
            rangesToDecorate.push(decoration);
            match = regexIdVariable.exec(text);
        }
    }

    function check_gotoNumbers(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /GOTO ?(\d+)/g;
        const hoverMessage = 'GOTO missing target number';
        if (!activeEditor) {
            return;
        }
        const text = activeEditor.document.getText();
        const regexIdVariable = regex;
        let match = regexIdVariable.exec(text);
        let firstLineNumber = null;
        while (match) {
            const re = new RegExp(String.raw`N ?${match[1]}(?:$|\s)`, 'g');
            const nmatch = re.exec(text);
            if (nmatch == null) {
                if (firstLineNumber == null) {
                    firstLineNumber = activeEditor.document.positionAt(match.index).line + 1;
                }
                const startPos = activeEditor.document.positionAt(match.index);
                const endPos = activeEditor.document.positionAt(match.index + match[0].length);
                const decoration = {
                    range: new vscode.Range(startPos, endPos),
                    hoverMessage: hoverMessage
                        .replace(/\$\{match\[1\]\}/g, match[1])
                        .replace(/\$\{match\[2\]\}/g, match[2]), // e.g. `An ID of 0 would evaluate to falsy. Consider: ${match[1]} != null`
                };
                rangesToDecorate.push(decoration);
            }
            match = regexIdVariable.exec(text);
        }
    }
}

export function deactivate() {
    // Clean up
    Control.terminate();

    // Close Logger
    Logger.close();
}
