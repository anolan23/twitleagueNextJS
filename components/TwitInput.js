import React, { useState, useEffect, useRef } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";
import ContentEditable from "react-contenteditable";

import twitInput from "../sass/components/TwitInput.module.scss";
import TwitButton from "./TwitButton";
import {toggleGifModal, saveCurrentPostText, saveCurrentOutlook, togglePopupCompose} from "../actions";
import GifThumb from "./GifThumb";
import Avatar from "../components/Avatar";

function TwitInput(props){

    const contentEditable = useRef(null);
    const allowableChars = 300;
    const chars = props.postText.length;
    const expanded = props.expanded?twitInput["twit-input__text-area--expanded"]: null;

    const handleInput = (event) => {
                const innerText = event.target.innerText;
                console.log(innerText);
                props.saveCurrentPostText(innerText);
    };

    const onContentEditableFocus = (event) => {
                if(chars > 0){
                    return;
                }
                const initialValue = props.initialValue;
                contentEditable.current.innerHTML = `<span class="twit-link" contenteditable="false">${initialValue}&nbsp;</span>`;
    }

    const disabled = () => {
        return chars === 0 || chars > allowableChars;
    }

    const onSubmit = (event) => {
        event.preventDefault();
        props.onSubmit();
        contentEditable.current.innerHTML = "";
    }

    return(
        <form className={twitInput["twit-input"]} onSubmit={onSubmit}>
            <Avatar roundedCircle className={twitInput["twit-input__image"]} src={props.avatar}/>
            <div 
                className={`${twitInput["twit-input__text-area"]} ${expanded}`} 
                contentEditable="true" 
                placeholder={props.placeHolder}
                onInput={handleInput}
                onFocus={onContentEditableFocus}
                ref={contentEditable}
                >

                </div>
            <div className={twitInput["twit-input__actions"]}>
                <div className={twitInput["twit-input__media-types"]}>
                    <div className={twitInput["twit-input__media-type"]}>
                        <svg className={twitInput["twit-input__icon"]}>
                            <use xlinkHref="/sprites.svg#icon-image"/>
                        </svg>
                    </div>
                    <div className={twitInput["twit-input__media-type"]}>
                    <div className={`${twitInput["twit-input__icon"]} ${twitInput["twit-input__gif"]}`}>
                    GIF
                    </div>
                        {/* <svg className={twitInput["twit-input__icon"]}>
                            <use xlinkHref="/sprites.svg#icon-image"/>
                        </svg> */}
                    </div>
                </div>
                <div className={twitInput["twit-input__action"]}>
                    <div className={twitInput["twit-input__action__char-count"]} disabled={chars>allowableChars}>{allowableChars - chars}</div>
                    <TwitButton disabled={disabled()} color="twit-button--primary">{props.buttonText}</TwitButton>
                </div>

            </div>
        </form>
    )
}

// function TwitInput(props) {

//     const [display, setDisplay] = useState(false);
//     const [html, setHtml] = useState(null);
//     const ref = useRef();
//     const contentEditable = useRef(null);

//     useEffect(() => {
//         document.body.addEventListener("click", clickOutsideInput);
//         const contentElement = document.getElementById('my-content');
//         contentElement.addEventListener('paste', function(e) {
//             // Prevent the default action
//             e.preventDefault();

//             // Get the copied text from the clipboard
//             const text = (e.clipboardData)
//                 ? (e.originalEvent || e).clipboardData.getData('text/plain')
//                 // For IE
//                 : (window.clipboardData ? window.clipboardData.getData('Text') : '');
            
//             if (document.queryCommandSupported('insertText')) {
//                 document.execCommand('insertText', false, text);
//             } else {
//                 // Insert text at the current position of caret
//                 const range = document.getSelection().getRangeAt(0);
//                 range.deleteContents();

//                 const textNode = document.createTextNode(text);
//                 range.insertNode(textNode);
//                 range.selectNodeContents(textNode);
//                 range.collapse(false);

//                 const selection = window.getSelection();
//                 selection.removeAllRanges();
//                 selection.addRange(range);
//             }
//         });

//             return () => {
//                 document.body.removeEventListener("click", clickOutsideInput);
//               }
//     }, []);

//     useEffect(() => {
//         if(display){
//             setCaret(contentEditable.current)
//         }
//     }, [display]);

//     const clickOutsideInput = (event) => {
//         if(ref.current.contains(event.target)){
//             return;
//         }
//         setDisplay(false);
//     }

//     const onClick = (event) => {
//         if(!display){
//             setDisplay(true);
//         }
//         setCaret(contentEditable.current)
//     }
    

//     const handleChange = (event) => {
//         const html = event.target.value
//         let text = contentEditable.current.innerText;
//         props.saveCurrentPostText(text);
//         setHtml(html);
//         };

//     const linkify = () => {
//         const text = contentEditable.current.innerText;
//         const html = replaceText(text)
//         const newHTML = html.join("");
//         setHtml(newHTML);
//     }

//     const renderGifThumbnail = () => {
//         if(props.staticGifImage){
//             return <GifThumb src={props.staticGifImage.url}/>
//         }
//     }

//     const onBullishClick = () => {
//         props.saveCurrentOutlook("bullish");
//         linkify();
        
//     }

//     const onBearishClick = () => {
//         props.saveCurrentOutlook("bearish");
//         setCaret(contentEditable.current)
//     }

//     const replaceText = (text) => {
//         const replacedText = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
//         `<span contenteditable="false" class="twit-link">${"$"+match}</span>`
//     ));
//     return replacedText
//     }

//     const setCaret = (el) => {
//         console.log("setCaret")
//         var range = document.createRange();  
//         console.log(el.childNodes)
//         range.setStart(el.lastChild, 0);
//         var sel = window.getSelection();
//         range.collapse(true);
//         sel.removeAllRanges();
//         sel.addRange(range);
//         el.focus();    
//      }

//     const onContentEditableFocus = () => {
//         console.log("focused")       
//     }

//     const renderInitials = () => {
//             return `<span contenteditable="false" class="twit-link">${props.initialValue}&nbsp</span>`
//     }

//         return (
//             <div className={styles["twit-input"]}>
//                 <Avatar roundedCircle className={styles.avatar}/>
//                     <Form 
//                     onSubmit={props.onSubmit} 
//                     className={styles["post-form"]} 
//                     style={{display: props.hide ? "none" : "flex"}}
//                     >
//                     <div onClick={onClick} className={styles["twit-post"]} ref={ref}>
//                         <ContentEditable 
//                             html={html || renderInitials()}
//                             onChange={handleChange} 
//                             innerRef={contentEditable}
//                             style={{display: display || props.expanded ? "block" : "none"}} 
//                             className={styles["twit-content"]} 
//                             onFocus={onContentEditableFocus}
//                             aria-expanded={display} 
//                             spellCheck="true" 
//                             id="my-content" 
//                             >
//                         </ContentEditable>
//                         <div className={styles["gif-div"]}>
//                         {renderGifThumbnail()}
//                         </div>
//                         <div className={styles["action-bar"]}>
//                             <div 
//                                 contentEditable="false" 
//                                 className = {styles.placeHolder}
//                                 id="placeHolder"
//                                 style={{display: display ? "none" : "block"}}
//                                 suppressContentEditableWarning={true}
//                             >
//                             {props.placeHolder}
//                             </div>
//                             <div className={styles["actions"]}>
//                                 <Button onClick={onBullishClick} variant="success" className={props.outlook === "bullish" ? styles["outlook-pressed"] : styles.outlook}>
//                                 Bullish
//                                 </Button>
//                                 <Button onClick={onBearishClick} variant="danger" className={props.outlook === "bearish" ? styles["outlook-pressed"] : styles.outlook}>
//                                 Bearish
//                                 </Button>
//                                 <i onClick={props.toggleGifModal} className={"far fa-image " + styles.icons}></i>                        
//                             </div>
//                         </div>
//                     </div>

//                     <textarea id="my-textarea" style={{display:"none"}}></textarea>   
                        
//                     <Button type="submit">
//                         Post
//                     </Button>
//                 </Form>
//             </div>
//         );
    


// }

const mapStateToProps = (state) => {
  
        return {
            staticGifImage: state.post.gif.images? state.post.gif.images.fixed_width_small_still : null,
            outlook: state.post.outlook,
            postText: state.post.postText,
            avatar: state.user.avatar
        }
}

export default connect(mapStateToProps, {toggleGifModal, saveCurrentPostText, saveCurrentOutlook, togglePopupCompose})(TwitInput);