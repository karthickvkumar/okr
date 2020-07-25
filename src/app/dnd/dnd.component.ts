import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DOCUMENT } from "@angular/common";
import { debounce } from "@agentepsilon/decko";

interface TreeNode {
  id: string;
  children: TreeNode[];
  isExpanded?: boolean;
}

interface DropInfo {
  targetId: string;
  action?: string;
}

@Component({
  selector: 'app-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.css']
})
export class DndComponent implements OnInit {

  nodes: TreeNode[] = [
    {
      id: 'item 1',
      children: []
    },
    {
      id: 'item 2',
      children: [
        {
          id: 'item 2.1',
          children: []
        },
        {
          id: 'item 2.2',
          children: []
        },
        {
          id: 'item 2.3',
          children: []
        }
      ]
    },
    {
      id: 'item 3',
      children: []
    }
  ];

  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;


  constructor(@Inject(DOCUMENT) private document: Document) {
    this.prepareDragDrop(this.nodes);
  }

  ngOnInit(): void {
  }

  prepareDragDrop(nodes: TreeNode[]) {
    nodes.forEach(node => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }


  @debounce(50)
  dragMoved(event) {
    let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains("node-item") ? e : e.closest(".node-item");
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute("data-id")
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 4;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo["action"] = "before";
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo["action"] = "after";
    }
    // else {
    //   // inside
    //   this.dropActionTodo["action"] = "inside";
    // }
    this.showDragInfo();
  }

  cardEdit() {
    console.log("edit")
  }

  drop(event) {
    if (!this.dropActionTodo) return;

    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');

    // console.log(
    //   '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
    //   '\n[' + this.dropActionTodo.action + ']\n[' + this.dropActionTodo.targetId + '] from list [' + targetListId + ']');

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer = parentItemId != 'main' ? this.nodeLookup[parentItemId].children : this.nodes;
    const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].children : this.nodes;


    console.log(this.dropActionTodo.action)

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        let i = oldItemContainer.findIndex(c => c.id === draggedItemId);
        oldItemContainer.splice(i, 1);

        const targetIndex = newContainer.findIndex(c => c.id === this.dropActionTodo.targetId);
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        //this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem)
        //this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }
    setTimeout(() => {
      this.clearDragInfo(true)
    }, 200)
  }

  getParentNodeId(id: string, nodesToSearch: TreeNode[], parentId: string): string {
    for (let node of nodesToSearch) {
      if (node.id == id) return parentId;
      let ret = this.getParentNodeId(id, node.children, node.id);
      if (ret) return ret;
    }
    return null;
  }

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      this.document.getElementById("node-" + this.dropActionTodo.targetId).classList.add("drop-" + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll(".drop-before")
      .forEach(element => element.classList.remove("drop-before"));
    this.document
      .querySelectorAll(".drop-after")
      .forEach(element => element.classList.remove("drop-after"));
    this.document
      .querySelectorAll(".drop-inside")
      .forEach(element => element.classList.remove("drop-inside"));

  }
}
