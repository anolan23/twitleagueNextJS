import React, { useState, useEffect, useRef } from "react";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";
import Link from "next/link"
import ContentEditable from "react-contenteditable";

import mainInput from "../sass/components/MainInput.module.scss";
import TwitButton from "./TwitButton";
import {toggleGifPopup, saveCurrentPostText, saveCurrentOutlook, togglePopupCompose} from "../actions";
import TwitGif from "./TwitGif";
import Avatar from "./Avatar";
import TwitDropdown from "./TwitDropdown";
import TwitItem from "./TwitItem";
import backend from "../lib/backend";

class MainInput extends React.Component {
    contentEditable = React.createRef();
    state = {html: '', showDropdown: false, options: [], cursor: 0};
    allowableChars = 300;
    chars = this.props.postText.length;
    expanded = this.props.expanded?mainInput["main-input__text-area--expanded"]: null;

    componentDidMount(){
        this.contentEditable.current.addEventListener('keyup', (event) => {
            const selection = getSelection();
            if (selection.type === "Caret") {
                console.log("componentDidMount keyup")
                const id = selection.anchorNode.parentElement.id;
                const data = selection.anchorNode.data;
                if(id === "team"){
                    this.teamSearch(data);
                }
                else if(id === "user"){
                    this.userSearch(data);
                }
                else if((event.keyCode !== 38 && event.keyCode !== 40)){
                    console.log(event.keyCode)
                    this.setState({showDropdown: false, cursor: 0})
                }
            }
        })
    }

    async teamSearch(search){
        const teams = await backend.get("/api/teams", {
            params:{
                search: search.substring(1)
            }
        })
        this.setState({options: teams.data, showDropdown: true})
    }

    async userSearch(search){
        const users = await backend.get("/api/users", {
            params:{
                search: search.substring(1)
            }
        })
        this.setState({options: users.data, showDropdown: true})
    }

    handleChange = (event) => {
        let text = this.contentEditable.current.innerText;
        text = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
            `<a class="twit-link" id="team">$${match}</a>`
        ));
        text = reactStringReplace(text, /\@(\w+)/g, (match, i) => (
            `<a class="twit-link" id="user">@${match}</a>`
        ));
        text = text.join('');
        // props.saveCurrentPostText(event.target.innerText);
        this.setState({html: text});
    };

    onContentEditableFocus = (event) => {
        if(this.chars > 0){
            return;
        }
        const initialValue = this.props.initialValue;
    }

    handleKeyDown = (event) => {
        console.log(event.keyCode)
        if (event.keyCode === 38 && this.state.cursor > 0) {
            event.preventDefault();
            this.setState( prevState => ({
            cursor: prevState.cursor - 1
          }))
        } 
        else if (event.keyCode === 40 && this.state.cursor < this.state.options.length - 1) {
            event.preventDefault();
            this.setState( prevState => ({
            cursor: prevState.cursor + 1
          }))
        }
        else if (event.keyCode === 13) {
            const {options, cursor} = this.state;
            event.preventDefault();
            this.onOptionClick(options[cursor]);
        }
    }

    disabled = () => {
        return this.chars === 0 || this.chars > allowableChars;
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit();
        this.setState({html: ""})
    }

    renderGif = () => {
        if(this.props.gif){
            return <TwitGif gif={this.props.gif}/>
        }
    }

    setCaret = (element) => {
        var range = document.createRange();  
        range.setStart(element.lastChild, 0);
        var selection = window.getSelection();
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        element.focus();    
    }

    onOptionClick = (option) => {
        const selection = getSelection();
        const id = selection.anchorNode.parentElement.id
        if (selection.type === "Caret") {
            if(id === "team"){
                selection.anchorNode.parentElement.innerHTML = `${option.abbrev}&nbsp;`;
                this.setCaret(this.contentEditable.current)
                const html = this.contentEditable.current.innerHTML;
                this.setState({html: html,showDropdown: false, cursor: 0});
            }
            else if(id === "user"){
                selection.anchorNode.parentElement.innerHTML = `@${option.username}&nbsp;`;
                this.setCaret(this.contentEditable.current)
                const html = this.contentEditable.current.innerHTML;
                this.setState({html: html,showDropdown: false, cursor: 0});
            }
            
        }
    }

    renderOptions = () => {
        if(!this.state.options){
            return
        }
        return this.state.options.map((option, index) => {

            if(option.team_name){
                return (
                    <TwitItem 
                        key={index} 
                        active={this.state.cursor === index ? true : false}
                        onClick={() => this.onOptionClick(option)} 
                        avatar={option.avatar} 
                        title={option.team_name} 
                        subtitle={option.abbrev}/>
                )
            }
            else if(option.username){
                return (
                    <TwitItem 
                        key={index} 
                        active={this.state.cursor === index ? true : false}
                        onClick={() => this.onOptionClick(option)} 
                        avatar={option.avatar} 
                        title={option.name} 
                        subtitle={`@${option.username}`}/>
                )
            }
            
        })
    }

    render() {
        return(
            <form className={mainInput["main-input"]} onSubmit={this.onSubmit} onKeyDown={this.handleKeyDown}>
                <Avatar roundedCircle className={mainInput["main-input__image"]} src={this.props.avatar}/>
                <ContentEditable
                    className={`${mainInput["main-input__text-area"]} ${this.expanded}`}
                    innerRef={this.contentEditable}
                    html={this.state.html}
                    disabled={false}
                    onChange={this.handleChange}
                    onFocus={this.onContentEditableFocus}
                    placeholder={this.props.placeHolder}
                />
                {this.renderGif()}
                <div className={mainInput["main-input__actions"]}>
                    <div className={mainInput["main-input__media-types"]}>
                        <div className={mainInput["main-input__media-type"]}>
                            <svg className={mainInput["main-input__icon"]}>
                                <use xlinkHref="/sprites.svg#icon-image"/>
                            </svg>
                        </div>
                        <div className={mainInput["main-input__media-type"]}>
                            <div onClick={this.props.toggleGifPopup} className={`${mainInput["main-input__icon"]} ${mainInput["main-input__gif"]}`}>
                                GIF
                            </div>
                        </div>
                    </div>
                    <div className={mainInput["main-input__action"]}>
                        <div className={mainInput["main-input__action__char-count"]} disabled={this.chars>this.allowableChars}>{this.allowableChars - this.chars}</div>
                        <TwitButton disabled={this.disabled()} color="twit-button--primary">{this.props.buttonText}</TwitButton>
                    </div>
                    <TwitDropdown show={this.state.showDropdown}>
                        {this.renderOptions()}
                    </TwitDropdown>
    
                </div>
            </form>
        )
    }
}

// function MainInput(props) {

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
//             <div className={styles["main-input"]}>
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
//                                 <i onClick={props.toggleGifPopup} className={"far fa-image " + styles.icons}></i>                        
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
            gif: state.post.gif ? state.post.gif : null,
            outlook: state.post.outlook,
            postText: state.post.postText,
            avatar: state.user.avatar
        }
}

export default connect(mapStateToProps, {toggleGifPopup, saveCurrentPostText, saveCurrentOutlook, togglePopupCompose})(MainInput);