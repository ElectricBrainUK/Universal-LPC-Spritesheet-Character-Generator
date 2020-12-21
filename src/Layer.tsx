import React, {Component} from 'react'

type params = {
    width: number,
    height: number,
    image: string,
    oversized?: boolean,
    oversizedSlash?: boolean,
    setImage: any,
    index: number
};

class Layer extends Component<params> {
    private image: React.RefObject<any>;
    state = {
        width: 0,
        height: 0,
        image: "",
        oversized: false
    };
    setImage: any;
    index: number;

    constructor(props: any) {
        super(props);
        this.image = React.createRef();
        this.setImage = props.setImage;
        this.index = props.index;
        this.state = {...props};
    }

    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
        const image = this.image.current;
        if (!image || image.src === "") {
            return this.setImage("off", 0, 0, 0, 0, this.index);
        }
        image.onload = () => {
            if (this.props.oversized) {
                this.setImage(this.image.current, 0, 1344, image.width, image.height, this.index);
            } else {
                this.setImage(this.image.current, 0, 0, image.width, image.height, this.index);
            }
        };
        image.onerror = (e: any) => {
            console.log(image);
            console.log(e)
        };
    }

    render() {
        return (
            <>
                {this.props.image !== "off" ? <img ref={this.image} src={this.props.image} alt={""}
                                                   className="hidden"/> : ""}
            </>
        )
    }
};

export default Layer;
