import React from "react";
import {connect} from "react-redux";
import reactStringReplace from "react-string-replace";
import Link from "next/link"
import ContentEditable from "react-contenteditable";

import mainInput from "../sass/components/MainInput.module.scss";
import TwitButton from "./TwitButton";
import {toggleGifPopup, saveCurrentPostText, saveCurrentOutlook, togglePopupCompose, setMedia} from "../actions";
import TwitMedia from "./TwitMedia";
import Avatar from "./Avatar";
import TwitDropdown from "./TwitDropdown";
import TwitItem from "./TwitItem";
import backend from "../lib/backend";
import TwitBadge from "./TwitBadge";
import TwitIcon from "./TwitIcon";
import {uploadToS3} from "../lib/aws-helpers";
import ReactPlayer from "react-player";


class MainInput extends React.Component {
    contentEditable = React.createRef();
    hiddenFileInput = React.createRef();
    state = {
        post: {
            body: null, 
            outlook: null
        }, 
        html: '', 
        showDropdown: false, 
        options: [], 
        cursor: 0, 
        media: null, 
        files: null};
    allowableChars = 300;
    chars = () => this.contentEditable.current ? this.contentEditable.current.innerText.length : 0;
    expanded = this.props.expanded ? mainInput["main-input__text-area--expanded"] : null;

    componentDidMount(){
        this.contentEditable.current.addEventListener('keyup', (event) => {
            const selection = getSelection();
            if (selection.type === "Caret") {
                const id = selection.anchorNode.parentElement.id;
                const data = selection.anchorNode.data;
                if(id === "team"){
                    this.teamSearch(data);
                }
                else if(id === "user"){
                    this.userSearch(data);
                }
                else if((event.keyCode !== 38 && event.keyCode !== 40)){
                    this.setState({showDropdown: false, cursor: 0})
                }
            }
        });

        document.addEventListener("gif-click", this.onGifClick);
    }

    componentWillUnmount(){
        document.removeEventListener("gif-click", this.onGifClick);
    }

    onGifClick = (event) => {
        this.setState({media: [{location: event.detail.gif.id, type: "giphy"}]})
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
        let newPost = {...this.state.post, body: text};
        this.setState({post: newPost});
        reactStringReplace(text, /(https?:\/\/\w?w?w?.?youtube\S+)/g, (match, i) => {
            if(ReactPlayer.canPlay(match)){
                let media = [{
                    location: match,
                    type: "link"
                }];
                this.setState({media});
            }
            else{
                this.setState({media: null})
            }
        }
            
        );
        text = reactStringReplace(text, /\$(\w+)/g, (match, i) => (
            `<a class="twit-link" id="team">$${match}</a>`
        ));
        text = reactStringReplace(text, /\@(\w+)/g, (match, i) => (
            `<a class="twit-link" id="user">@${match}</a>`
        ));
        text = reactStringReplace(text, /(https?:\/\/\S+)/g, (match, i) => (
            `<a class="twit-link" id="link">${match}</a>`
        ));
        text = text.join('');
        this.setState({html: text});
    };

    handleKeyDown = (event) => {
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
        else if (event.keyCode === 13 || event.keyCode === 9) {
            const {options, cursor} = this.state;
            event.preventDefault();
            this.onOptionClick(options[cursor]);
        }
    }

    disabled = () => {
        return this.chars() === 0 || this.chars() > this.allowableChars;
    }

    onUploadToS3 = (uploadedFiles) => {
        let media = uploadedFiles.map(uploadedFile => {
            let type = uploadedFile.Location.substring(uploadedFile.Location.lastIndexOf('.') + 1);
            return {location: uploadedFile.Location, type: type} 
        });
        media = JSON.stringify(media);
        let post = {...this.state.post, media: media}
        this.props.onSubmit(post);
        this.setState({media: null, files: null, html: ""})
    }

    onSubmit = (event) => {
        event.preventDefault();
        const files = this.state.files;
        
        if(files){
            let promises = [];
            files.forEach(file => {
                promises.push(uploadToS3(file, "posts"));
            });
            Promise.all(promises).then((uploadedFiles) => this.onUploadToS3(uploadedFiles))

        }
        else{
            const media = this.state.media ? JSON.stringify(this.state.media) : null;
            let post = {...this.state.post, media};
            this.props.onSubmit(post);
            this.setState({media: null, files: null, html: ""})
        }
    }

    renderMedia = () => {
        if(this.state.media === null){
            return null;
        }
        else{
            return this.state.media.map((mediaItem, index) => {
                const mediaItemArray = [mediaItem];
                return (
                        <TwitMedia key={index} close media={mediaItemArray} onClick={() => this.setState({media: null, files: null})}/> 
                ) 
            })
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

    onMoneyClick = () => {
        let html = this.state.html;
        html = html.concat("$");
        this.setState({html: html});
        this.contentEditable.current.focus();
    }

    onAtClick = () => {
        let html = this.state.html;
        html = html.concat("@");
        this.setState({html: html});
        this.contentEditable.current.focus();
    }

    onHotClick = () => {
        const outlook = this.state.post.outlook;
        if(outlook === null || !outlook){
            let newPost = {...this.state.post, outlook: true};
            this.setState({post: newPost});
        }
        else{
            let newPost = {...this.state.post, outlook: null};
            this.setState({post: newPost});
        }
        
    }

    onColdClick = () => {
        const outlook = this.state.post.outlook;
        if(outlook === null || outlook){
            let newPost = {...this.state.post, outlook: false};
            this.setState({post: newPost});
        }
        else{
            let newPost = {...this.state.post, outlook: null};
            this.setState({post: newPost});
        }
    }

    onUploadClick = event => {
        this.hiddenFileInput.current.click();
  };

    promiseFileReader = (file) => {  
        return new Promise((resolve, reject) => {
            const reader = new FileReader();  
            reader.onload = () => {
                resolve(reader.result)
            };  // CHANGE to whatever function you want which would eventually call resolve
            reader.readAsDataURL(file);
    });
  }

    handleUploadChange = event => {
        let files = event.target.files;
        files = Object.values(files);
        const videos = files.filter(file => file.type.includes("video"));
        const images = files.filter(file => file.type.includes("image"));
        const gifs = files.filter(file => file.type.includes("gif"));
        const numVideos = videos.length;
        const numImages = images.length;
        const numGifs = gifs.length;
        let uploadData = [];
        
        if(numVideos === 1 && numImages === 0 && numGifs === 0){
            const promise = Promise.resolve();
            files.map(file => promise.then(() => this.promiseFileReader(file)).then((dataUrl) => {
                uploadData.push({location: dataUrl, type: file.type})
                this.setState({media: uploadData, files});
            }));
        }
        else if(numImages > 0 && numImages <= 4 && numVideos === 0 && numGifs === 0){
            const promise = Promise.resolve();
            files.map(file => promise.then(() => this.promiseFileReader(file)).then((dataUrl) => {
                uploadData.push({location: dataUrl, type: file.type})
                this.setState({media: uploadData, files});
            }));
        }
        else if(numGifs === 1 && numVideos === 0 & numImages === 1){
            const promise = Promise.resolve();
            files.map(file => promise.then(() => this.promiseFileReader(file)).then((dataUrl) => {
                uploadData.push({location: dataUrl, type: file.type})
                this.setState({media: uploadData, files});
            }));
        }
        else{
            alert("Please choose either 1 Gif or up to 4 photos")
            this.setState({files: null})
        }      
  };

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
                        title={`${option.team_name}`} 
                        subtitle={`${option.abbrev} · ${option.league_name}`}/>
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
        console.log(this.state. media)
        return(
            <form className={this.props.compose ? `${mainInput["main-input"]} ${mainInput["main-input__compose"]}` : mainInput["main-input"]} onSubmit={this.onSubmit} onKeyDown={this.handleKeyDown}>
                <Avatar roundedCircle className={mainInput["main-input__image"]} src={this.props.avatar}/>
                <ContentEditable
                    className={`${mainInput["main-input__text-area"]} ${this.expanded}`}
                    innerRef={this.contentEditable}
                    html={this.state.html}
                    disabled={false}
                    onChange={this.handleChange}
                    placeholder={this.props.placeHolder}
                />
                <div className={mainInput["main-input__media-grid"]}>
                    {this.renderMedia()}
                </div>
                <div className={mainInput["main-input__actions"]}>
                    <div className={mainInput["main-input__media-types"]}>
                            <TwitIcon onClick={this.onUploadClick} className={mainInput["main-input__media-types__icon"]} icon="/sprites.svg#icon-image"></TwitIcon>
                            <input multiple type="file" ref={this.hiddenFileInput} onChange={this.handleUploadChange} style={{display:"none"}}></input>
                            <TwitIcon onClick={this.props.toggleGifPopup} className={mainInput["main-input__media-types__icon"]} icon="/sprites.svg#icon-plus-circle">GIF</TwitIcon>
                            <TwitIcon onClick={this.onMoneyClick} className={mainInput["main-input__media-types__icon"]} icon="/sprites.svg#icon-map-pin">$</TwitIcon>
                            <TwitIcon onClick={this.onAtClick} className={mainInput["main-input__media-types__icon"]} icon="/sprites.svg#icon-bookmark">@</TwitIcon>
                            <TwitBadge onClick={this.onHotClick} active={this.state.post.outlook === true}>Hot</TwitBadge>
                            <TwitBadge onClick={this.onColdClick} active={this.state.post.outlook === false}>Cold</TwitBadge>
                    </div>
                    <div className={mainInput["main-input__action"]}>
                        <div className={mainInput["main-input__action__char-count"]} disabled={this.chars()>this.allowableChars}>{this.allowableChars - this.chars()}</div>
                        <TwitButton disabled={this.disabled()} color="twit-button--primary">{this.props.buttonText}</TwitButton>
                    </div>
                    <div className={mainInput["main-input__dropdown"]}>
                        <TwitDropdown show={this.state.showDropdown}>
                            {this.renderOptions()}
                        </TwitDropdown>
                    </div>
                    
    
                </div>
            </form>
        )
    }
}

const mapStateToProps = (state) => {
    return {avatar: state.user.avatar}
}

export default connect(mapStateToProps, {toggleGifPopup, saveCurrentPostText, saveCurrentOutlook, togglePopupCompose, setMedia})(MainInput);