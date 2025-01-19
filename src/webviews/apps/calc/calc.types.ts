/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { SyntaxMachineTypes } from '../../../util/machine.types';

export interface ICalcDom {
    rpm?: {
        btn: HTMLElement;
        speed: HTMLInputElement;
        toolDia: HTMLInputElement;
        results: HTMLSpanElement;
    };

    speed?: {
        btn: HTMLElement;
        rpm: HTMLInputElement;
        toolDia: HTMLInputElement;
        results: HTMLSpanElement;
    };

    feedrate?: {
        btn: HTMLElement;
        rpm: HTMLInputElement;
        numFlutes: HTMLInputElement;
        chipLoad: HTMLInputElement;
        results: HTMLSpanElement;
    };

    chipLoad?: {
        btn: HTMLElement;
        feedRate: HTMLInputElement;
        rpm: HTMLInputElement;
        numFlutes: HTMLInputElement;
        results: HTMLSpanElement;
    };

    mrr?: {
        btn: HTMLElement;
        axialDepth: HTMLInputElement;
        radialDepth: HTMLInputElement;
        feedRate: HTMLInputElement;
        results: HTMLSpanElement;
    };

    finish?: {
        btn: HTMLElement;
        radius: HTMLInputElement;
        feedRate: HTMLInputElement;
        results: HTMLSpanElement;
    };
}

export type TCalcDom = ICalcDom[keyof ICalcDom];

export enum Units {
    Inch = 'Inch',
    MM = 'Metric',
    Default = 'Default (Inch)',
}

export interface calcBootstrap {
    machineType: SyntaxMachineTypes;
    units: Units;
}
