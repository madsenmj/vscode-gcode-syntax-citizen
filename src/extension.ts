/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import * as vscode from 'vscode';
import { Config, configuration } from './util/config';
import { constants } from './util/constants';
import { Logger } from './util/logger';
import { StatusBar } from './util/statusBar';
import { GCodeTreeProvider } from './providers/gcodeTree';
import { GCodeStatsProvider } from './providers/gcodeStats';

//import { GCodeHoverProvider } from './providers/gcodeHover';
//import { getColorization } from './colorization';


export async function activate(context: vscode.ExtensionContext) {

    const start = process.hrtime();

    Logger.configure(context);
    Logger.enable();

    Config.configure(context);

    StatusBar.configure(context);

    Logger.log(constants.extension.shortname + " v" + constants.extension.version + " activated.");
    Logger.log(constants.copyright);

    // G-Code Tree View
    Logger.log("Loading Tree View...");
    const gcodeTree = new GCodeTreeProvider(context);
    vscode.window.registerTreeDataProvider('gcode.gcodeTree', gcodeTree);

    vscode.commands.registerCommand('gcode.gcodeTree.refresh', () => {
        if (vscode.window.activeTextEditor?.document.languageId === constants.langId) {
            vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', true);
        }
        gcodeTree.refresh();        
    });
    vscode.commands.registerCommand('gcode.gcodeTree.Selection', range => gcodeTree.select(range));

    
    Logger.log('Tree AutoRefresh: ' + (configuration.getParam('treeAutoRefresh') ? 'Enabled' : 'Disabled') );

    // G-Code Stats View
    Logger.log("Loading Stats View...");
    const gcodeStats = new GCodeStatsProvider(context);
    vscode.window.registerTreeDataProvider('gcode.gcodeStats', gcodeStats);

    vscode.commands.registerCommand('gcode.gcodeStats.refresh', () => {
        //gcodeStats.refresh();
    });
    vscode.commands.registerCommand('gcode.gcodeStats.enable', () => {
        Logger.log('Enabling Stats...');
        configuration.setParam('statsEnable', true);

        }
    );

    Logger.log('Stats: ' + (configuration.getParam('statsEnable') ? 'Enabled' : 'Disabled') );


    /*
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            GCODE, new GCodeHoverProvider()
        )
    );


    if (gcodeconf.colorization) {

        // Gcode Configuration is on

        console.log('gcode.colorization:' + gcodeconf.colorization);

    }

    


    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {

            if (e.affectsConfiguration('gcode.colorization')) {

                // Get Configuration
                let gcodeconf: vscode.WorkspaceConfiguration = util.getConfig();
             
                console.log('gcode.colorization:' + gcodeconf.colorization);
            
                if (vscode.workspace.getConfiguration().get('gcode.colorization')) {
                    console.log('toggle on');

                    let colors = getColorization();

                    if (vscode.workspace.getConfiguration().has('editor.tokenColorCustomizations')) {
                        let tokenColors = vscode.workspace.getConfiguration('editor.tokenColorCustomization');
                        console.log('Storing User Colorization');
                        let userColors = util.storeUserTokenColorCustomizations(tokenColors);
                    }

                    console.log('No textMateRules. Adding colorization\n' + colors)
                    
                    // textMateRules doesn't exist so add it
                    vscode.workspace.getConfiguration().update(
                        'editor.tokenColorCustomizations',
                        {
                            "textMateRules": colors
                        },
                        vscode.ConfigurationTarget.Global
                    );
                    console.log('Added.');
                    console.log(vscode.workspace.getConfiguration('editor.tokenColorCustomization').has('textMateRules'));

                } else {
                    console.log('toggle off');
                    vscode.workspace.getConfiguration().update(
                        'editor.tokenColorCustomizations',
                        undefined,
                        vscode.ConfigurationTarget.Global
                    );
                    console.log('Removed');
                    console.log(vscode.workspace.getConfiguration('editor.tokenColorCustomization').has('textMateRules'));
                }
            }

    }));*/
}

export function deactivate() {
    // Clean up
    Logger.close();
    StatusBar.dispose();
}