/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { SyntaxMachineType, SyntaxMachineTypes } from '../../util/machine.types';
import { TextDecoder } from 'util';
import { commands, ConfigurationChangeEvent, Disposable, Uri, Webview, workspace } from 'vscode';
import { Control } from '../../control';
import { configuration } from '../../util/configuration/config';
import { defaults } from '../../util/configuration/defaults';
import { Contexts, WebviewCommands, Webviews, WebviewTitles } from '../../util/constants';
import { Logger } from '../../util/logger';
import { GWebviewView } from '../gWebviewView';
import { getNonce } from '../helpers';
import { WebviewMsg } from '../webviewMsg.types';

export class CalcWebviewView extends GWebviewView {
    private _shortId: string;
    private _machineType: SyntaxMachineType;

    constructor() {
        const title = `${WebviewTitles.CalcWebviewView} (${
            Control.machineTypeController.machineType.toString() ?? ''
        })`;

        super(Webviews.CalcWebviewView, title);

        this._shortId = this.id.split('.').pop() ?? '';
        this._machineType = Control.machineTypeController.machineType;

        if ((this._enabled = configuration.getParam(`${this.id.slice(6)}.enabled`) ?? defaults.webviews.calc.enabled)) {
            Logger.log('Loading Calculator...');

            if (
                this._machineType === SyntaxMachineTypes.Mill ||
                this._machineType === SyntaxMachineTypes.Lathe ||
                this._machineType === SyntaxMachineTypes.Swiss ||
                this._machineType === SyntaxMachineTypes.CitizenSwiss
            ) {
                void Control.setContext(Contexts.CalcWebviewViewEnabled, true);
            } else {
                void Control.setContext(Contexts.CalcWebviewViewEnabled, false);
            }
        }

        this._disposables.push(
            configuration.onDidChange(this._onConfigurationChanged, this),
            Control.unitsController.onDidChangeUnits(this._changeUnits, this),
            Control.machineTypeController.onDidChangeMachineType(this._changeMachineType, this),
        );
    }

    private _onConfigurationChanged(e: ConfigurationChangeEvent) {
        // Enable / Disable Calculator Webview
        if (configuration.changed(e, `${this.id.slice(6)}.enabled`)) {
            if (this._enabled) {
                // Disable
                void Control.setContext(Contexts.CalcWebviewViewEnabled, false);
                Logger.log('Disabling Calculator...');
            } else {
                // Enable
                Logger.log('Loading Calculator...');
                void Control.setContext(Contexts.CalcWebviewViewEnabled, true);
            }

            this._enabled = configuration.getParam(`${this.id.slice(6)}.enabled`) ?? defaults.webviews.calc.enabled;
        }
    }

    protected override registerCommands(): Disposable[] {
        return [
            commands.registerCommand(
                WebviewCommands.ShowCalcWebview,
                () => {
                    void this.show();
                },
                this,
            ),
        ];
    }

    protected override bootstrap(): WebviewMsg {
        return {
            type: 'bootstrap',
            payload: { units: Control.unitsController.units, machineType: Control.machineTypeController.machineType },
        };
    }

    protected async getHtml(webview: Webview): Promise<string> {
        const webRootUri = Uri.joinPath(Control.context.extensionUri, 'dist', 'webviews');
        const uri = Uri.joinPath(webRootUri, this._shortId, `${this._shortId}.html`);
        const content = new TextDecoder('utf8').decode(await workspace.fs.readFile(uri));

        const cspSource = webview.cspSource;
        const cspNonce = getNonce();

        const root = webview.asWebviewUri(Control.context.extensionUri).toString();

        const bootstrap = this.bootstrap();

        // vscode-webview-ui-toolkit
        const toolkitUri = webview.asWebviewUri(
            Uri.joinPath(
                Control.context.extensionUri,
                'node_modules',
                '@vscode',
                'webview-ui-toolkit',
                'dist',
                'toolkit.js',
            ),
        );

        const html = content.replace(/{(bootstrap|cspNonce|cspSource|root|title|toolkit)}/g, (_substring, token) => {
            switch (token) {
                case 'cspNonce':
                    return cspNonce.toString();

                case 'cspSource':
                    return cspSource.toString();

                case 'root':
                    return root;

                case 'title':
                    return `<title>${this.title}</title>`;

                case 'toolkit':
                    return `<script nonce="${cspNonce}" type="module" src="${toolkitUri.toString()}"></script>`;

                case 'bootstrap':
                    return `<script type="text/javascript" nonce="${cspNonce}">
                        const __BOOTSTRAP__ = ${JSON.stringify(bootstrap)};
                        </script>`;

                default:
                    return '';
            }
        });

        return Promise.resolve(html);
    }

    private async _changeUnits() {
        if (this._enabled) {
            await this.postMessage({ type: 'changeUnits', payload: Control.unitsController.units });
        }
    }

    private async _changeMachineType(e: SyntaxMachineType) {
        this._machineType = e;

        if (
            this._machineType === SyntaxMachineTypes.Mill ||
            this._machineType === SyntaxMachineTypes.Lathe ||
            this._machineType === SyntaxMachineTypes.Swiss ||
            this._machineType === SyntaxMachineTypes.CitizenSwiss
        ) {
            if (this._enabled) {
                void Control.setContext(Contexts.CalcWebviewViewEnabled, true);
                this.title = `${WebviewTitles.CalcWebviewView} (${this._machineType.toString()})`;
                await this.postMessage({
                    type: 'changeMachineType',
                    payload: Control.machineTypeController.machineType,
                });
            }
        } else {
            void Control.setContext(Contexts.CalcWebviewViewEnabled, false);
        }
    }
}
