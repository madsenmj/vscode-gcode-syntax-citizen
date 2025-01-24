/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { TreeItemCollapsibleState } from 'vscode';
import { constants } from '../../util/constants';
import * as path from 'path';
import { IconType, ViewNode } from './nodes';

export class NavTreeNode extends ViewNode<NavTreeNode> {
    _children: NavTreeNode[];
    constructor(public readonly label: string, public readonly collapsibleState: TreeItemCollapsibleState) {
        super(label);
        this._children = [];
    }

    setIcon(type: IconType): void {
        this.iconPath = {
            light: path.join(constants.iconsPath, 'light', `${type}.svg`),
            dark: path.join(constants.iconsPath, 'dark', `${type}.svg`),
        };
    }

    getTreeItem(): ViewNode | Promise<ViewNode> {
        return this;
    }

    getChildren(): NavTreeNode[] | Promise<NavTreeNode[]> {
        return this._children;
    }
}
