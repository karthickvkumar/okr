import { Component, OnInit, ViewChild } from '@angular/core';
import { ITreeState, ITreeOptions } from '@circlon/angular-tree-component';
import { v4 } from 'uuid';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.css']
})
export class TreeviewComponent implements OnInit {

  @ViewChild('tree') tree;

  options: ITreeOptions = {
    allowDrag: (node) => node.isLeaf,
    getNodeClone: (node) => ({
      ...node.data,
      id: v4(),
      name: `copy of ${node.data.name}`
    })
  };

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { name: 'child1' },
        { name: 'child2' }
      ]
    },
    {
      name: 'root2',
      id: 2,
      children: [
        { name: 'child2.1', children: [] },
        {
          name: 'child2.2', children: [
            { name: 'grandchild2.2.1' }
          ]
        }
      ]
    },
    { name: 'root3' },
    { name: 'root4', children: [] },
    { name: 'root5', children: null }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onTreeLoad() {
    this.tree.treeModel.expandAll();
  }

}
