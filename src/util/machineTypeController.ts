/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ConfigurationChangeEvent, Disposable, Event, EventEmitter } from 'vscode';
import { GReference } from '../gReference';
import { MachineTypes } from '../types/machinetypes';
import { Variants } from '../types/variants';
import { SyntaxMachineType, SyntaxMachineTypes } from './machine.types';
import { configuration } from './configuration/config';
import { Logger } from './logger';
import { StatusBar, StatusBarControl } from './statusBar';
import { Control } from '../control';
import { GCommands } from './constants';
import { defaults } from './configuration/defaults';

export class MachineTypeController implements Disposable {
    private readonly _dispoables: Disposable[] = [];
    private _machineType: SyntaxMachineType = defaults.general.machineType;
    private _statusbar: StatusBarControl;
    private readonly mtypeStatusBar: StatusBar = 'machineTypeBar';
    private _gReference: GReference;

    private _onDidChangeMachineType: EventEmitter<SyntaxMachineType> = new EventEmitter<SyntaxMachineType>();
    get onDidChangeMachineType(): Event<SyntaxMachineType> {
        return this._onDidChangeMachineType.event;
    }

    constructor() {
        this._statusbar = Control.statusBarController;
        this._gReference = new GReference();
        this._update();

        this._dispoables.push(configuration.onDidChange(this._onConfigurationChanged, this));
    }

    dispose() {
        Disposable.from(...this._dispoables).dispose();
    }

    private _onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'general.machineType')) {
            this._update();
        } else {
            return;
        }
    }

    private _update() {
        const cfgMachineType = <string>configuration.getParam('general.machineType') ?? defaults.general.machineType;
        let initMachineType = MachineTypes.Mill;
        let initVariantType = undefined;
        Logger.log(`Machine Type: ${cfgMachineType}`);
        switch (cfgMachineType) {
            case 'Mill':
                this._machineType = SyntaxMachineTypes.Mill;
                initMachineType = MachineTypes.Mill;
                break;

            case 'Lathe':
                this._machineType = SyntaxMachineTypes.Lathe;
                initMachineType = MachineTypes.Lathe;
                break;

            case '3D Printer':
                this._machineType = SyntaxMachineTypes.Printer;
                initMachineType = MachineTypes.Printer;
                break;

            case 'Swiss':
                this._machineType = SyntaxMachineTypes.Swiss;
                initMachineType = MachineTypes.Swiss;
                break;

            case 'Citizen Swiss':
                this._machineType = SyntaxMachineTypes.CitizenSwiss;
                initMachineType = MachineTypes.Swiss;
                initVariantType = Variants.Citizen;
                break;

            case 'Laser':
                this._machineType = SyntaxMachineTypes.Laser;
                initMachineType = MachineTypes.Laser;
                break;

            case 'EDM':
                this._machineType = SyntaxMachineTypes.EDM;
                initMachineType = MachineTypes.EDM;
                break;

            default:
                return;
        }

        // Update Status Bar
        this._statusbar.updateStatusBar(
            cfgMachineType,
            this.mtypeStatusBar,
            undefined,
            undefined,
            GCommands.ShowGCodeSettings,
        );

        // Update GReference
        this._gReference.setType(initMachineType);

        if (initVariantType) {
            this._gReference.setVariant(initVariantType);
        }

        // Fire Event
        this._onDidChangeMachineType.fire(this._machineType);
    }

    get gReference() {
        return this._gReference;
    }

    get machineType() {
        return this._machineType;
    }
}
