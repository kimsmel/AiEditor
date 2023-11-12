import {Extensions} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {Underline} from "@tiptap/extension-underline";
import {TextStyle} from "@tiptap/extension-text-style";
import {FontFamily} from "@tiptap/extension-font-family";
import {AttachmentExt} from "../extensions/AttachmentExt.ts";
import {PainterExt} from "../extensions/PainterExt.ts";
import {Highlight} from "@tiptap/extension-highlight";
import {Color} from "@tiptap/extension-color";
import {FontSizeExt} from "../extensions/FontSizeExt.ts";
import {LineHeightExt} from "../extensions/LineHeightExt.ts";
import {TextAlign} from "@tiptap/extension-text-align";
import {IndentExt} from "../extensions/IndentExt.ts";
import {ImageExt} from "../extensions/ImageExt.ts";
import {Table} from "@tiptap/extension-table";
import {TableRow} from "@tiptap/extension-table-row";
import {TableHeader} from "@tiptap/extension-table-header";
import {TableCell} from "@tiptap/extension-table-cell";
import {CharacterCount} from "@tiptap/extension-character-count";
import {Link} from "@tiptap/extension-link";
import {Superscript} from "@tiptap/extension-superscript";
import {Subscript} from "@tiptap/extension-subscript";
import {TaskList} from "@tiptap/extension-task-list";
import {TaskItem} from "@tiptap/extension-task-item";
import {CodeBlockExt} from "../extensions/CodeBlockExt.ts";
import {common, createLowlight} from "lowlight";
import {VideoExt} from "../extensions/VideoExt.ts";
import {IFrameExt} from "../extensions/IFrameExt.ts";
import {getBubbleMenus} from "./getBubbleMenus.ts";
import {Placeholder} from "@tiptap/extension-placeholder";
// import {HocuspocusProvider} from "@hocuspocus/provider";
// import {Collaboration} from "@tiptap/extension-collaboration";
import {createMention} from "../extensions/MentionExt.ts";
import {AiEditor, AiEditorOptions} from "./AiEditor.ts";
import {AiCommandExt, defaultCommands} from "../extensions/AiCommandExt.ts";

export const getExtensions = (editor: AiEditor, options: AiEditorOptions): Extensions => {
    // the Collaboration extension comes with its own history handling
    const ret: Extensions = options.cbName && options.cbUrl ? [StarterKit.configure({
        history: false,
        codeBlock: false,
    })] : [StarterKit.configure({
        codeBlock: false
    })];

    {
        //push default extensions
        ret.push(Underline, TextStyle, FontFamily,
            AttachmentExt.configure({
                uploadUrl: options.video?.uploadUrl,
                uploadHeaders: options.video?.uploadHeaders,
                uploader: options.video?.uploader || options.uploader,
            }),
            PainterExt,
            Highlight.configure({
                multicolor: true
            }),
            Color, FontSizeExt, LineHeightExt,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            IndentExt,
            ImageExt.configure({
                allowBase64: true,
                uploadUrl: options.image?.uploadUrl,
                uploadHeaders: options.image?.uploadHeaders,
                uploader: options.image?.uploader || options.uploader,
            }),
            Table.configure({
                resizable: true,
                lastColumnResizable: true,
                allowTableNodeSelection: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            CharacterCount,
            Link.configure({
                openOnClick: false,
            }),
            Superscript,
            Subscript,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CodeBlockExt.configure({
                lowlight: createLowlight(common),
                defaultLanguage: 'plaintext',
                languageClassPrefix: 'language-',
            }),
            VideoExt.configure({
                uploadUrl: options.video?.uploadUrl,
                uploadHeaders: options.video?.uploadHeaders,
                uploader: options.video?.uploader || options.uploader,
            }),
            IFrameExt,
            ...getBubbleMenus(editor),
        )
    }

    if (options.placeholder) {
        ret.push(Placeholder.configure({
            placeholder: options.placeholder,
        }))
    }

    // if (options.ai?.command){
        ret.push(AiCommandExt.configure({
            suggestion:{
                items:(_)=>{
                    const commands = options.ai?.command || defaultCommands;
                    return commands as any;
                    // return commands.filter(item => item.keyword.toLowerCase().startsWith(query.toLowerCase()))
                    //     .slice(0, 10) as any;
                }
            }
        }))
    // }

    // if (options.cbName && options.cbUrl) {
    //     const provider = new HocuspocusProvider({
    //         url: options.cbUrl,
    //         name: options.cbName,
    //     })
    //     ret.push(Collaboration.configure({
    //         document: provider.document,
    //     }))
    // }

    if (options.onMentionQuery) {
        ret.push(createMention(options.onMentionQuery))
    }

    return ret;
}