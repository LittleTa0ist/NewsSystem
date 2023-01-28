import React, { useState, useEffect } from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './NewsEditor.css'
import { convertToRaw,ContentState, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
const NewsEditor = (props) => {
    const [editorState, setEditorState] = useState(null);
    useEffect(() => {
        if (props.content === undefined) return
        const html = props.content
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.content]);
    return (
        <Editor
            onBlur={() => props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))}
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="content"
            onEditorStateChange={(editorState) => {
                setEditorState(editorState)

            }}
        />
    )
}

export default NewsEditor;
