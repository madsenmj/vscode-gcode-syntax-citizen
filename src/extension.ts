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
        check_ifHasGoto(rangesToDecorate);
        check_whileHasDo(rangesToDecorate);
        check_invalidComparitor(rangesToDecorate);
        check_gFollowedByDirection(rangesToDecorate);
        check_missingGCode(rangesToDecorate);
        check_doNumbers(rangesToDecorate);
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
        const regex = /(G0?[23][^0-9] ?[^R]*(\(|$))/g;
        const hoverMessage = 'G2/3 Missing Radius';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function check_ifHasGoto(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /IF\[.*\] ?(?!GOTO)(?:\(|$)/gm;
        const hoverMessage = 'IF statement missing GOTO';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function check_whileHasDo(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /WHILE\[.*\] ?(?!DO)(?:\(|$)/gm;
        const hoverMessage = 'WHILE statement missing DO';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function check_invalidComparitor(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /(?:(?:IF)|(?:WHILE))\[(?!.*?(GT|LT|GE|LE|EQ|NE)).+\]/g;
        const hoverMessage = 'Invalid comparitor in statment';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function check_gFollowedByDirection(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /G(?:32|83|87|0?1|0?2|0?3)[^0-9] ?(?![XYZUVW]).*(?:\(|$)/g;
        const hoverMessage = 'Missing direction XYZUVW';
        genericCheck(regex, hoverMessage, rangesToDecorate);
    }

    function check_missingGCode(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /^[XYZUV].*|^W(?!HILE).*/gm;
        const hoverMessage = 'Missing G-code at line start';
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
            const reMatch = new RegExp(String.raw`N ?${match[1]}(?:$|\s)`, 'g');
            const nmatch = reMatch.exec(text);
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

    function check_doNumbers(rangesToDecorate: vscode.DecorationOptions[]) {
        const regex = /DO ?(\d+)/g;
        const hoverMessage = 'DO missing corresponding END number';
        if (!activeEditor) {
            return;
        }
        const text = activeEditor.document.getText();
        const regexIdVariable = regex;
        let match;
        let firstLineNumber = null;
        while ((match = regexIdVariable.exec(text)) !== null) {
            const followingText = text.slice(match.index + match[0].length);
            const reMatch = new RegExp(String.raw`END ?${match[1]}(?:$|\s)`, 'g');
            const nmatch = reMatch.exec(followingText);
            let hasError = false;
            // No END match was found - this is a problem and report it
            if (nmatch == null) {
                hasError = true;
            } else {
                // Check that there isn't a matchin DO statement before the found END
                const intermediateText = followingText.substring(0, nmatch.index);
                const recheckIdVariable = new RegExp(String.raw`DO ?${match[1]}(?:$|\s)`, 'g');
                const rematch = recheckIdVariable.exec(intermediateText);
                if (rematch != null) {
                    hasError = true;
                }
            }
            if (hasError) {
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
        }
    }
}

export function deactivate() {
    // Clean up
    Control.terminate();

    // Close Logger
    Logger.close();
}
