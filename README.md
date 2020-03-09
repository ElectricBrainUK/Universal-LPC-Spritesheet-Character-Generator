Universal LPC Spritesheet Character Generator
=============================================

Based on [Universal LPC Spritesheet](https://github.com/jrconway3/Universal-LPC-spritesheet).

Which was extended by Sanderfrenken [here](https://github.com/sanderfrenken/Universal-LPC-Spritesheet-Character-Generator).

The project you are looking now is an expansion on the above mentioned projects.
I have re arranged the files provided by Sanderfrenken so that my code can process by directory, adding an image in the relevant directory is all that is needed now! It also allows for random character generation.
I also re wrote the code in react, meaning it can be added directly into a react project (I have a phaser 3 app that now has randomly generated characters which I will share soon)

The Liberated Pixel Effort is a collaborative effort from a number of different great artists who helped produce sprites for the project.
Please read the [authors](AUTHORS.txt) file for the full list of authors who have contributed to the spritesheet.

If you want to know how to include sprites from this sheet into your work, please visit the [Open Game Art LPC forums](http://opengameart.org/forums/liberated-pixel-cup).
You will need to credit everyone who helped contribute to the LPC sprites you intend to use if you wish to use LPC sprites in your project.

### Licensing

According to the rules of the LPC all art submissions were dual licensed under both GNU GPL 3.0 and CC-BY-SA 3.0. These art submissions are considered all images present in the directory `spritesheets` and it's subdirectories. Further work produced in this repository is licensed under the same terms.

CC-BY-SA 3.0:
 - http://creativecommons.org/licenses/by-sa/3.0/
 - See the file: [cc-by-sa-3.0](cc-by-sa-3_0.txt)

GNU GPL 3.0:
 - http://www.gnu.org/licenses/gpl-3.0.html
 - See the file: [gpl-3.0](gpl-3_0.txt)

### Run

To run this project, just clone the repo and run ``npm i`` followed by ``npm run start``
In order to use the code I include this component in a project with a React reference and set the class to a variable that can toggle its visibility (starting invisible).
I then call creatorRef.generateRandom(type, include, exclude) all of the arguments are optional, the type can be male, female, undead, child or pregnant (if blank one will be chosen at random) then include and exclude are arrays of strings to force the inclusion or exclusion of directory names (anything left out will be random).
Then I have a timeout to check the status of creatorRef.imageReady, once it is ready I call creatorRef.getImage() which returns the image, and some details about the type of image (oversized, slash/ thrust etc.) which I then import into my game.

### Caution

This is not an example of a perfectly coded project, and it does have bugs.

### Support
Please join our discord server for help and if you feel like this has been of a big benefit please feel free to donate as we do all of our work in our spare time!
https://discord.gg/Qa3Bjr9
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=9EC6MMLG7KLNA&source=url)
