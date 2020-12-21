import React, {Component} from 'react'
import Layer from "./Layer";
import './CharacterCreator.css';
import {
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRadio,
    IonRadioGroup,
    IonSelect,
    IonSelectOption
} from "@ionic/react";
import {image} from "ionicons/icons";

interface Props {

}

interface State {
    width: number,
    height: number,
    bodyType: string,
    bodyName: string,
    torso: any,
    layers: any;
    details: any;
    oversized: boolean;
    oversizedSlash: boolean;
    slash: boolean;
    walkOnly: boolean;
    credits: any;
}

class CharacterCreator extends Component<Props, State> {
    public imageReady = false;
    private awaiting = 0;
    private imageTimeout: any;
    private sprites: any;
    private spriteFiles: String[];
    private bodies: JSX.Element[];
    private capes: JSX.Element[];
    private canvas: React.RefObject<any>;
    private layers: any[];
    private excludeFromAuto = ["cape", "behind_body", "body", "torso", "ears", "nose", "fullBody", "shadow"];

    importAll(r: any) {
        return r.keys().map(r);
    };

    constructor(props: any) {
        super(props);
        this.state = {
            width: 832 + 704, height: 1344 + 768, bodyType: "", bodyName: "",
            torso: [], layers: {
                bodyType: "", shadow: "", capeFront: "", capeBack: "",
                quiver: "",
                bandage: "",
                torso: [],
                arms: "",
                hands: ""
            },
            details: {},
            oversized: false,
            oversizedSlash: false,
            slash: false,
            walkOnly: false,
            credits: []
        };
        this.bodyTypeChanged = this.bodyTypeChanged.bind(this);
        this.bodyChanged = this.bodyChanged.bind(this);
        this.shadowChanged = this.shadowChanged.bind(this);
        this.capeChanged = this.capeChanged.bind(this);
        this.quiverChanged = this.quiverChanged.bind(this);
        this.bandageChange = this.bandageChange.bind(this);
        this.createTorsoLayer = this.createTorsoLayer.bind(this);
        this.selectorChanged = this.selectorChanged.bind(this);
        this.generateRandom = this.generateRandom.bind(this);
        this.redraw = this.redraw.bind(this);
        this.setImage = this.setImage.bind(this);
        this.sprites = require.context("./spritesheets", true, /\.(png|jpe?g|svg)$/);
        this.spriteFiles = require.context("./spritesheets", true, /\.(png|jpe?g|svg)$/).keys();
        this.bodies = [];
        this.capes = [];
        this.layers = [];
        this.canvas = React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        console.log(this.state.credits);
        this.redraw();
    }

    redraw() {
        clearTimeout(this.imageTimeout);
        this.imageReady = false;
        if (!this.layers || this.layers.length === 0 || this.layers.filter(layer => layer.image && layer.image !== "off").length === 0) {
            return;
        }
        const ctx = this.canvas.current.getContext("2d");
        ctx.clearRect(0, 0, this.state.width, this.state.height);
        let weaponLayer: any = {};
        this.layers.forEach(layer => {
            if (layer && layer.image !== "off") {
                ctx.drawImage(layer.image, layer.xOffset, layer.yOffset, layer.width, layer.height);
                if (layer.yOffset === 1344) {
                    weaponLayer = layer;
                }
            }
        });
        if (this.state.oversized && weaponLayer.image) {
            if (this.state.oversizedSlash) {
                for (var i = 0; i < 6; ++i) {
                    for (var j = 0; j < 4; ++j) {
                        var imgData = ctx.getImageData(64 * i, 768 + 64 * j, 64, 64);
                        ctx.putImageData(imgData, 64 + 192 * i, 1408 + 192 * j);
                    }
                }
            } else {
                for (var i = 0; i < 8; ++i) {
                    for (var j = 0; j < 4; ++j) {
                        var imgData = ctx.getImageData(64 * i, 256 + 64 * j, 64, 64);
                        ctx.putImageData(imgData, 64 + 192 * i, 1408 + 192 * j);
                    }
                }
            }
            ctx.drawImage(weaponLayer.image, weaponLayer.xOffset, weaponLayer.yOffset, weaponLayer.width, weaponLayer.height);
        }
        if (this.layers.filter(layer => layer.image && layer.image !== "off").length >= this.awaiting - 1) {
            this.imageReady = true;
        } else {
            this.imageTimeout = setTimeout(() => this.imageReady = true, 500);
        }
    }

    setImage(image: any, xOffset: number, yOffset: number, width: number, height: number, index: number) {
        this.layers[index] = {image, xOffset, yOffset, width, height};
        this.redraw();
    }

    getImage() {
        return {
            image: this.canvas.current.toDataURL("image/png"),
            oversized: this.state.oversized,
            slash: this.state.slash,
            walkOnly: this.state.walkOnly
        }
    }

    getCredit(item: any) {
        try {
            return (require(item.replace(".png", ".credit").replace("./", "https://raw.githubusercontent.com/ElectricBrainUK/Universal-LPC-Spritesheet-Character-Generator/master/src/spritesheets/")));
        } catch (err) {
            console.log(err);
            return "uncredited";
        }
    }

    generateRandom(bodyType?: string, forceInclude?: any, forceExclude?: any) {
        this.imageReady = false;
        const check = Math.random();
        if (!bodyType) {
            bodyType = check < 0.2 ? "female" : check < 0.4 ? "male" : check < 0.6 ? "undead" : check < 0.8 ? "child" : "pregnant";
        }
        if (!forceInclude) {
            forceInclude = [];
        }
        if (!forceExclude) {
            forceExclude = [];
        }
        let layers: any = {};
        let credits: any = {};

        const path = './body/' + bodyType + "/";
        const images = this.spriteFiles.filter(file => {
            return file.includes(path)
        });
        while (!layers.bodyType && images.length > 0) {
            try {
                let imageNumber = Math.floor(Math.random() * images.length);
                layers.bodyType = this.sprites(images[imageNumber]).default || this.sprites(images[imageNumber]);
                credits.bodyType = images[imageNumber].replace(".png", ".credit");
            } catch (e) {
                console.log(e);
                break;
            }
        }

        let oversized = false;
        let oversizedSlash = false;
        let slash = false;
        let files = this.directories();
        files.filter(file => !this.excludeFromAuto.includes(file) || file === "torso").forEach(path => {
            let files = this.spriteFiles.filter(file => {
                return file.includes("/" + path + "/") && (file.includes(path + "/" + bodyType) || ((bodyType === "male" || bodyType === "female" || bodyType === "undead") && (file.includes(path + "/unisex") || file.includes(path + "/universal"))))
            });
            var item = files[Math.floor(Math.random() * files.length)];
            while (!item && forceInclude.includes(path) && files.length > 0) {
                item = files[Math.floor(Math.random() * files.length)];
            }
            if (item) {
                credits[path] = item.replace(".png", ".credit");
            }

            if ((Math.random() < 0.5 || forceInclude.includes(path)) && path !== "torso" && item && !forceExclude.includes(path)) {
                layers[path] = this.sprites(item).default || this.sprites(item);
            }
            if (path === "torso" && item) {
                layers[path] = [this.sprites(item).default || this.sprites(item)];
            }
            if (path === "melee" && item) {
                layers[path] = this.sprites(item).default || this.sprites(item);
                slash = item.toLowerCase().includes("slash");
                if (item.includes("oversize") && !item.includes("universal")) {
                    if (item.includes("attack")) {
                        const universalFile = item.replace("attack", "universal");
                        oversizedSlash = item.toLowerCase().includes("slash");
                        oversized = true;
                        layers[path + "Universal"] = this.sprites(universalFile).default || this.sprites(universalFile) || "off"
                        credits[path + "Universal"] = universalFile.replace(".png", ".credit");
                    } else {
                        oversizedSlash = item.toLowerCase().includes("slash");
                        oversized = true;
                        layers[path + "Universal"] = "off";
                    }
                }
            }
        });
        if (!layers.torso) {
            layers.torso = [];
        }
        this.awaiting = Object.keys(layers).length;
        // @ts-ignore
        this.setState({
            bodyType,
            layers,
            credits,
            oversized,
            oversizedSlash,
            slash,
            walkOnly: bodyType === "pregnant" || bodyType === "child"
        });
    }

    createRadioOption(file: string, path: string) {
        return <IonItem key={file as string}>
            <IonLabel>{file.replace(path, "")}</IonLabel>
            <IonRadio slot="start" value={file}/>
        </IonItem>
    }

    createTorsoLayer() {
        const layer = this.state.torso.length;
        this.setState({
            //@ts-ignore
            torso: [
                <IonItem key={layer}>
                    <IonLabel>Torso Layer</IonLabel>
                    <IonSelect onIonChange={(e) => this.torsoLayerChanged(layer, e)}>
                        <IonSelectOption value={"off"}>
                            Disable
                        </IonSelectOption>
                        {
                            this.spriteFiles.filter(file => file.includes("./torso/" + this.state.bodyType)).map((file) => {
                                return (<IonSelectOption key={file as string} value={file}>
                                    {file.replace("./torso/" + this.state.bodyType + "/", "")}
                                </IonSelectOption>)
                            })
                        }
                    </IonSelect>
                </IonItem>
                , ...this.state.torso]
        });
    }

    torsoLayerChanged(layer: number, e: any) {
        let temp = this.state.layers.torso;
        let tempCred = this.state.credits.torso;
        if (!temp) {
            temp = [];
        }
        if (!tempCred) {
            tempCred = [];
        }
        if (!temp[layer]) {
            // @ts-ignore
            temp[layer] = "off";
        }
        if (e.detail.value === "off") {
            // @ts-ignore
            temp[layer] = "off";
        } else {
            // @ts-ignore
            temp[layer] = this.sprites(e.detail.value).default || this.sprites(e.detail.value);
            tempCred[layer] = e.detail.value.replace(".png", ".credit");
        }
        this.setState({
            layers: {
                ...this.state.layers,
                torso: temp
            },
            credits: {
                ...this.state.credits,
                torso: tempCred
            }
        });
    }

    bodyChanged(e: any) {
        this.setState({
            bodyName: e.detail.value.replace('./body/' + this.state.bodyType + '/', ""),
            layers: {
                ...this.state.layers,
                bodyType: this.sprites(e.detail.value).default || this.sprites(e.detail.value)
            },
            credits: {
                ...this.state.credits,
                bodyType: e.detail.value.replace(".png", ".credit")
            }
        });
        let details = this.state.details;
        details['nose'] = (this.spriteFiles.filter(file => {
            return file.includes('./nose/' + this.state.bodyType) && file.includes(this.state.bodyName);
        }).map(file => {
            return this.createRadioOption(file as string, './nose/' + this.state.bodyType + '/');
        }));
        details['ears'] = (this.spriteFiles.filter(file => {
            return file.includes('./ears/' + this.state.bodyType) && file.includes(this.state.bodyName);
        }).map(file => {
            return this.createRadioOption(file as string, './ears/' + this.state.bodyType + '/');
        }));
        this.excludeFromAuto.splice(this.excludeFromAuto.indexOf('nose'), 1);
        this.excludeFromAuto.splice(this.excludeFromAuto.indexOf('ears'), 1);
        this.setState({details});
    }

    directories() {
        let files = this.spriteFiles.map(file => {
            const removedInitialSlash = file.replace("./", "");
            return removedInitialSlash.substring(0, removedInitialSlash.indexOf("/"));
        });
        files = files.filter((file, index) => {
            return files.indexOf(file) === index;
        });
        return files;
    }

    bodyTypeChanged(e: any) {
        const path = './body/' + e.detail.value + "/";
        const images = this.spriteFiles.filter(file => {
            return file.includes(path)
        });
        this.bodies = images.map((body) => {
            return this.createRadioOption(body as string, path);
        });
        if (this.state.bodyType === e.detail.value) {
            return;
        }
        this.setState({bodyType: e.detail.value, layers: {torso: []}, torso: []});

        const capePath = './behind_body/' + e.detail.value + "/";
        this.capes = this.getFilesInPath(capePath);

        let files = this.directories();
        let details = {};
        files.forEach(file => {
            // @ts-ignore
            details[file] = this.getFilesInPath("./" + file + "/" + e.detail.value + "/");
            // @ts-ignore
            details[file] = details[file].concat(this.getFilesInPath("./" + file + "/universal/"));
            // @ts-ignore
            details[file] = details[file].concat(this.getFilesInPath("./" + file + "/multiuniversal/")); //todo if multi then allow multiple selection
            if (e.detail.value === "male" || e.detail.value === "female") {
                // @ts-ignore
                details[file] = details[file].concat(this.getFilesInPath("./" + file + "/unisex/"));
            }
        });
        this.setState({details});
    }

    private getFilesInPath(path: string) {
        return this.spriteFiles.filter(file => {
            return file.includes(path);
        }).map((file) => {
            return this.createRadioOption(file as string, path);
        });
    }

    shadowChanged(e: any) {
        if (e.detail.value === "off") {
            return this.setState({layers: {...this.state.layers, shadow: "off"}});
        }
        if (this.state.layers.bodyType === "child") {
            const images = this.importAll(require.context('./spritesheets/shadow/child', true, /\.(png|jpe?g|svg)$/));
            this.setState({layers: {...this.state.layers, shadow: images[0]}});
        } else {
            const images = this.importAll(require.context('./spritesheets/shadow/universal', true, /\.(png|jpe?g|svg)$/));
            this.setState({
                layers: {
                    ...this.state.layers,
                    shadow: images.filter((image: any) => !image.includes("child"))[0]
                },
                credits: {
                    ...this.state.credits,
                    shadow: images.filter((image: any) => !image.includes("child"))[0].replace(".png", ".credit")
                }
            });
        }
    }

    quiverChanged(e: any) {
        if (e.detail.value === "off") {
            return this.setState({layers: {...this.state.layers, quiver: "off"}});
        }
        this.setState({
            layers: {
                ...this.state.layers,
                quiver: this.sprites('./behind_body/unisex/equipment/quiver.png').default || this.sprites(e.detail.value)
            },
            credits: {
                ...this.state.credits,
                quiver: './behind_body/unisex/equipment/quiver.credit'
            }
        });
    }

    bandageChange(e: any) {
        if (e.detail.value === "off") {
            return this.setState({layers: {...this.state.layers, bandage: "off"}});
        }
        try {
            this.setState({
                layers: {
                    ...this.state.layers,
                    bandage: this.sprites('./fullBody/' + this.state.bodyType + '/Bandage.png').default || this.sprites(e.detail.value)
                },
                credits: {
                    ...this.state.credits,
                    bandage: './fullBody/' + this.state.bodyType + '/Bandage.credit'
                }
            });
        } catch (e) { //todo bug with male bandage
            return this.setState({layers: {...this.state.layers, bandage: "off"}});
        }
    }

    capeChanged(e: any) {
        if (e.detail.value === "off") {
            return this.setState({layers: {...this.state.layers, capeFront: "off", capeBack: "off"}});
        }
        if (this.state.bodyType === "male") {
            let backSprite = e.detail.value.replace("Male_", "").replace("(JaidynReiman)", "").replace("male", "female");
            this.setState({
                layers: {
                    ...this.state.layers,
                    capeFront: this.sprites(e.detail.value).default || this.sprites(e.detail.value),
                    capeBack: this.sprites(backSprite).default || this.sprites(backSprite)
                },
                credits: {
                    ...this.state.credits,
                    capeFront: e.detail.value.replace(".png", ".credit"),
                    capeBack: backSprite.replace(".png", ".credit")
                }
            });
        } else {
            this.setState({
                layers: {
                    ...this.state.layers,
                    capeFront: "off", //todo maybe do the same as men and make all capes universal with a back and a front
                    capeBack: this.sprites(e.detail.value).default || this.sprites(e.detail.value)
                },
                credits: {
                    ...this.state.credits,
                    capeBack: e.detail.value.replace(".png", ".credit")
                }
            });
        }
    }

    selectorChanged(name: string, e: any) {
        if (e.detail.value === "off") {
            return this.setState({layers: {...this.state.layers, [name]: "off"}});
        }
        if (e.detail.value.includes("oversize") && !e.detail.value.includes("universal")) {
            if (e.detail.value.includes("attack")) {
                const universalFile = e.detail.value.replace("attack", "universal");
                this.setState({
                    oversizedSlash: e.detail.value.toLowerCase().includes("slash"),
                    oversized: true,
                    layers: {
                        ...this.state.layers,
                        [name + "Universal"]: this.sprites(universalFile).default || this.sprites(universalFile) || "off"
                    },
                    credits: {
                        ...this.state.credits,
                        [name + "Universal"]: universalFile.replace(".png", ".credit")
                    }
                });
            } else {
                this.setState({
                    oversizedSlash: e.detail.value.toLowerCase().includes("slash"),
                    oversized: true,
                    layers: {
                        ...this.state.layers,
                        [name + "Universal"]: "off"
                    }
                });
            }
        } else if (name === "melee") {
            this.setState({
                oversized: false
            });
        }
        this.setState({
            layers: {
                ...this.state.layers,
                [name]: this.sprites(e.detail.value).default || this.sprites(e.detail.value)
            },
            credits: {
                ...this.state.credits,
                [name]: e.detail.value.replace(".png", ".credit")
            }
        });
    }

    render() {
        return (
            <IonContent>
                <IonList>
                    <IonButton onClick={() => {
                        let a = document.createElement('a');
                        a.download = "spritesheet.png";
                        a.href = this.canvas.current.toDataURL();
                        a.target = '_blank';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        let creditDetails : any = {};

                        Object.keys(this.state.layers).forEach((key: any) => {
                            console.log(key);
                            if (this.state.layers[key] !== "off") {
                                if (key === "torso") {
                                    creditDetails[key] = [];

                                    for (let torsoItem = 0; torsoItem < this.state.layers[key].length; torsoItem++) {
                                        creditDetails[key].push(this.getCredit(this.state.credits[key][torsoItem]));
                                        torsoItem++;
                                    }
                                } else {
                                    creditDetails[key] = this.getCredit(this.state.credits[key])
                                }
                            }
                        });

                        let bl = new Blob([JSON.stringify(creditDetails)], {
                            type: "text/html"
                        });
                        a = document.createElement("a");
                        a.href = URL.createObjectURL(bl);
                        a.download = "credits.json";
                        a.hidden = true;
                        document.body.appendChild(a);
                        a.innerHTML = "someinnerhtml";
                        a.click();
                        document.body.removeChild(a);
                    }}>Save</IonButton>
                    <>
                        <h4>Credits and Attribution</h4>
                        It is incredibly important to credit any and all artwork you use in games or otherwise. Some
                        items on this utility are not properly credited, any uncredited artwork will be downloaded
                        seperately. I recommend you find the art on opengameart.org (you could reverse image search on
                        google) to get the attribution and if possible raise a pull request to update the credits on
                        this repo.
                    </>
                    <IonButton onClick={() => this.generateRandom(undefined, ["arrow", "bow"])}>Generate
                        Random</IonButton>
                    <IonRadioGroup value={this.state.bodyType} onIonChange={this.bodyTypeChanged}>
                        <IonListHeader>
                            <IonLabel>Body Type</IonLabel>
                        </IonListHeader>

                        <IonItem>
                            <IonLabel>Child</IonLabel>
                            <IonRadio slot="start" value="child"/>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Female</IonLabel>
                            <IonRadio slot="start" value="female"/>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Male</IonLabel>
                            <IonRadio slot="start" value="male"/>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Pregnant</IonLabel>
                            <IonRadio slot="start" value="pregnant"/>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Undead</IonLabel>
                            <IonRadio slot="start" value="undead"/>
                        </IonItem>
                    </IonRadioGroup>
                    {
                        this.state.bodyType ?
                            <IonRadioGroup onIonChange={this.shadowChanged}>
                                <IonListHeader>
                                    <IonLabel>Shadow</IonLabel>
                                </IonListHeader>

                                <IonItem>
                                    <IonLabel>On</IonLabel>
                                    <IonRadio slot="start" value="on"/>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>Off</IonLabel>
                                    <IonRadio slot="start" value="off"/>
                                </IonItem>
                            </IonRadioGroup>
                            : ""
                    }
                    {this.bodies.length > 0 ?
                        <IonRadioGroup onIonChange={this.bodyChanged}>
                            <IonListHeader>
                                <IonLabel>Body</IonLabel>
                            </IonListHeader>
                            {this.bodies}
                        </IonRadioGroup>
                        : ""}
                    {
                        this.state.bodyType ?
                            <IonRadioGroup onIonChange={this.capeChanged}>
                                <IonListHeader>
                                    <IonLabel>Cape</IonLabel>
                                </IonListHeader>
                                {this.capes}
                                <IonItem>
                                    <IonLabel>Off</IonLabel>
                                    <IonRadio slot="start" value="off"/>
                                </IonItem>
                            </IonRadioGroup>
                            : ""
                    }
                    {
                        this.state.bodyType && this.state.bodyType !== "child" ?
                            <IonRadioGroup onIonChange={this.quiverChanged}>
                                <IonListHeader>
                                    <IonLabel>Quiver</IonLabel>
                                </IonListHeader>

                                <IonItem>
                                    <IonLabel>On</IonLabel>
                                    <IonRadio slot="start" value="on"/>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>Off</IonLabel>
                                    <IonRadio slot="start" value="off"/>
                                </IonItem>
                            </IonRadioGroup>
                            : ""
                    }
                    {
                        this.state.bodyType && this.state.bodyType !== "child" ?
                            <IonRadioGroup onIonChange={this.bandageChange}>
                                <IonListHeader>
                                    <IonLabel>Bandages</IonLabel>
                                </IonListHeader>

                                <IonItem>
                                    <IonLabel>On</IonLabel>
                                    <IonRadio slot="start" value="on"/>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>Off</IonLabel>
                                    <IonRadio slot="start" value="off"/>
                                </IonItem>
                            </IonRadioGroup>
                            : ""
                    }
                    {this.state.bodyType ? <IonButton onClick={this.createTorsoLayer}>Add Torso Layer</IonButton> : ""}
                    {
                        this.state.torso
                    }
                    {
                        this.state.bodyType ?
                            Object.keys(this.state.details).filter(detail => !this.excludeFromAuto.includes(detail)).map(detail => {
                                return <IonRadioGroup key={detail} onIonChange={(e) => this.selectorChanged(detail, e)}>
                                    <IonListHeader>
                                        <IonLabel>{detail.substring(0, 1) + detail.substring(1)}</IonLabel>
                                    </IonListHeader>
                                    {this.state.details[detail]}
                                    <IonItem>
                                        <IonLabel>Off</IonLabel>
                                        <IonRadio slot="start" value="off"/>
                                    </IonItem>
                                </IonRadioGroup>
                            })
                            : ""
                    }
                </IonList>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.shadow}
                       setImage={this.setImage} index={0}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.capeBack}
                       setImage={this.setImage} index={1}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.quiver}
                       setImage={this.setImage} index={2}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.bodyType}
                       setImage={this.setImage} index={3}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.bandage}
                       setImage={this.setImage} index={4}>
                </Layer>
                {
                    this.state.layers.torso && this.state.layers.torso.length > 0 ? this.state.layers.torso.map((layer: string, index: number) => {
                        return (
                            <Layer key={index} width={this.state.width} height={this.state.height}
                                   setImage={this.setImage} index={4 + index}
                                   image={layer}></Layer>)
                    }) : ""
                }
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.eyes}
                       setImage={this.setImage} index={5 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.ears}
                       setImage={this.setImage} index={6 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.nose}
                       setImage={this.setImage} index={7 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.arms}
                       setImage={this.setImage} index={8 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.hands}
                       setImage={this.setImage} index={9 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.wrist}
                       setImage={this.setImage} index={10 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.shoulders}
                       setImage={this.setImage} index={11 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.neck}
                       setImage={this.setImage} index={12 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.facial}
                       setImage={this.setImage} index={13 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.hair}
                       setImage={this.setImage} index={14 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.legs}
                       setImage={this.setImage} index={15 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.feet}
                       setImage={this.setImage} index={16 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.belt}
                       setImage={this.setImage} index={17 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.head}
                       setImage={this.setImage} index={19 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.capeFront}
                       setImage={this.setImage} index={20 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.wounds}
                       setImage={this.setImage} index={21 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.shield}
                       setImage={this.setImage} index={22 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.bow}
                       setImage={this.setImage} index={23 + this.state.layers.torso.length}>
                </Layer>
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.arrow}
                       setImage={this.setImage} index={24 + this.state.layers.torso.length}>
                </Layer>
                {
                    this.state.oversized && this.state.layers.meleeUniversal ?
                        <Layer width={this.state.width} height={this.state.height} setImage={this.setImage}
                               index={25 + this.state.layers.torso.length}
                               image={this.state.layers.meleeUniversal}>
                        </Layer>
                        : ""
                }
                <Layer width={this.state.width} height={this.state.height} image={this.state.layers.melee}
                       setImage={this.setImage} index={26 + this.state.layers.torso.length}
                       oversized={this.state.oversized} oversizedSlash={this.state.oversizedSlash}>
                </Layer>
                <canvas className={"layer"} width={this.state.width} height={this.state.height}
                        ref={this.canvas}></canvas>
            </IonContent>
        )
    }
};

export default CharacterCreator;
