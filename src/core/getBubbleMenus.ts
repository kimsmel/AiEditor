import {Extensions, posToDOMRect} from "@tiptap/core";
import {AiEditor} from "./AiEditor.ts";
import {BubbleMenu} from "@tiptap/extension-bubble-menu";


import {LinkBubbleMenu} from "../components/bubbles/LinkBubbleMenu.ts";
import {AbstractBubbleMenu} from "../components/AbstractBubbleMenu.ts";
import {ImageBubbleMenu} from "../components/bubbles/ImageBubbleMenu.ts";
import {TableBubbleMenu} from "../components/bubbles/TableBubbleMenu.ts";

window.customElements.define('aie-bubble-link', LinkBubbleMenu);
window.customElements.define('aie-bubble-image', ImageBubbleMenu);
window.customElements.define('aie-bubble-table', TableBubbleMenu);


const createLinkBubbleMenu = (zEditor: AiEditor) => {

    const menuEl = document.createElement("aie-bubble-link") as AbstractBubbleMenu;
    zEditor.eventComponents.push(menuEl);

    return BubbleMenu.configure({
        pluginKey: 'linkBubble',
        element: menuEl,
        tippyOptions: {
            placement: 'bottom-end',
        },
        shouldShow: ({editor}) => {
            return editor.isActive("link")
        }
    })
}
const createImageBubbleMenu = (zEditor: AiEditor) => {

    const menuEl = document.createElement("aie-bubble-image") as AbstractBubbleMenu;
    zEditor.eventComponents.push(menuEl);


    return BubbleMenu.configure({
        pluginKey: 'imageBubble',
        element: menuEl,
        tippyOptions: {
            appendTo: zEditor.container,
            placement: 'top-start',
            getReferenceClientRect: (() => {
                const {ranges} = zEditor.innerEditor.state.selection
                const from = Math.min(...ranges.map(range => range.$from.pos))
                const to = Math.max(...ranges.map(range => range.$to.pos))
                const view = zEditor.innerEditor.view;

                let node = view.nodeDOM(from) as HTMLElement
                const imageEl = node.querySelector("img") as HTMLImageElement;

                const domRect = posToDOMRect(view, from, to);
                const imgRect = imageEl.getBoundingClientRect();
                return {
                    ...domRect,
                    left: imgRect.left + imgRect.width * 0.25
                }
            })
        },
        shouldShow: ({editor}) => {
            return editor.isActive("image")
        }
    })
}


const createTableBubbleMenu = (zEditor: AiEditor) => {

    const menuEl = document.createElement("aie-bubble-table") as AbstractBubbleMenu;
    zEditor.eventComponents.push(menuEl);

    return BubbleMenu.configure({
        pluginKey: 'tableBubble',
        element: menuEl,
        tippyOptions: {
            placement: 'top',
            getReferenceClientRect: (() => {
                const selection = zEditor.innerEditor.state.selection;
                const {ranges} = selection
                const from = Math.min(...ranges.map(range => range.$from.pos))
                const to = Math.max(...ranges.map(range => range.$to.pos))
                const view = zEditor.innerEditor.view;

                const domRect = posToDOMRect(view, from, to);
                const tablePos = zEditor.innerEditor.state.selection.$from.posAtIndex(0, 1);
                const coordsAtPos = zEditor.innerEditor.view.coordsAtPos(tablePos);

                return {
                    ...domRect,
                    top: coordsAtPos.top
                };
            })
        },
        shouldShow: ({editor}) => {
            return editor.isActive("table")
        }
    })
}


export const getBubbleMenus = (zEditor: AiEditor): Extensions => {
    const bubbleMenus: Extensions = [];

    bubbleMenus.push(createLinkBubbleMenu(zEditor))
    bubbleMenus.push(createImageBubbleMenu(zEditor))
    bubbleMenus.push(createTableBubbleMenu(zEditor))

    return bubbleMenus;
}
