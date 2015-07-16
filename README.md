# Google Images Downloader

![Cat](http://33.media.tumblr.com/5d933dbea55d887f28bb467c67bcb356/tumblr_mojk1em3ew1r4xjo2o1_250.gif)

## Installation

Works with NodeJS, download it [here](https://nodejs.org/).
Once installed, run in the project directory :
```bash
npm install
````

## Usage

To get 100 images related to `steak fries` :

```bash
node index.js "steak fries" 100
```

## Results

In the project folder, the script will create a `downloads` folder, with one folder per query, named upon the query itself.

For example, for `steak fries` you will find the images in `downloads/steak fries/`.
