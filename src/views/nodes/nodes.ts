/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';
import { StatsNode } from './statsNode';
import { NavTreeNode } from './navTreeNode';

export const enum ResourceType {
    Stats = 'gcode:stats',
    Tree = 'gcode:navTree',
}

export const enum IconType {
    Boring = 'boring',
    Cutting = 'cutting',
    CWCutting = 'cwcutting',
    CCWCutting = 'ccwcutting',
    CoolantOn = 'coolanton',
    CoolantOff = 'coolantoff',
    Dwell = 'dwell',
    Drill = 'drill',
    DrillDwell = 'drill-dwell',
    DrillPeck = 'drill-peck',
    Engraving = 'engraving',
    ExtSubProgram = 'extsubprog',
    LocalSub = 'localsubprog',
    Rapid = 'rapid',
    Refresh = 'refresh',
    Settings = 'settings',
    SubProgramReturn = 'subprogreturn',
    SpindleCW = 'spindlecw',
    SpindleCCW = 'spindleccw',
    Stop = 'stop',
    TappingRH = 'tapping-rh',
    TappingLH = 'tapping-lh',
    ToolChange = 'toolchange',
    WorkOffset = 'workoffset',
}

export interface Node {
    setIcon(icon: IconType | undefined): void;
    getChildren(): ViewNode[] | Promise<ViewNode[]>;
    getTreeItem(): TreeItem | Promise<TreeItem>;
    getCommand(): Command | undefined;
    refresh?(): void | boolean | Promise<void> | Promise<boolean>;
}

export type NodeTypes = NavTreeNode | StatsNode;

export abstract class ViewNode<NType extends NodeTypes = NodeTypes> extends TreeItem implements Node {
    constructor(
        private _name: string,
        private _description?: string,
        private _contextValue?: ResourceType,
        private _collapsible?: TreeItemCollapsibleState,
        private _tooltip?: string,
        private _iconPath?:
            | string
            | Uri
            | {
                  light: string | Uri;
                  dark: string | Uri;
              }
            | ThemeIcon,
        protected readonly parent?: ViewNode,
        protected readonly _type?: NType,
    ) {
        super(_name);

        if (_description !== undefined) {
            this.description = _description;
        }

        if (_contextValue !== undefined) {
            this.contextValue = _contextValue;
        }

        if (_collapsible !== undefined) {
            this.collapsibleState = _collapsible;
        }

        if (_tooltip !== undefined) {
            this.tooltip = _tooltip;
        }

        if (_iconPath !== undefined) {
            this.iconPath = _iconPath;
        }
    }

    abstract setIcon(icon: IconType | undefined): void;

    getChildren(): ViewNode[] | Promise<ViewNode[]> {
        return [];
    }
    getParent(): ViewNode | undefined {
        return this.parent;
    }

    abstract getTreeItem(): ViewNode | Promise<ViewNode>;

    getCommand(): Command | undefined {
        return undefined;
    }

    refresh?(): void | boolean | Promise<void> | Promise<boolean>;

    update?(changes: {
        name?: string;
        desc?: string;
        tooltip?: string;
        iconPath?:
            | string
            | Uri
            | {
                  light: string | Uri;
                  dark: string | Uri;
              }
            | ThemeIcon;
    }) {
        if (changes.name !== undefined) {
            this._name = changes.name;
        }

        if (changes.desc !== undefined) {
            this._description = changes.desc;
        }

        if (changes.tooltip !== undefined) {
            this._tooltip = changes.tooltip;
        }

        if (changes.iconPath !== undefined) {
            this._iconPath = changes.iconPath;
        }
    }
}
