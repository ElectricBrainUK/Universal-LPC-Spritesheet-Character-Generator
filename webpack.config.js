import "pixi";
import "p2";
import * as Phaser from "phaser-ce";

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path]/[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
};
