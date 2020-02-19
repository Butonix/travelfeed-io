import Button from '@material-ui/core/Button';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uploadFile from '../../../../../helpers/imageUpload';
import { asyncForEach } from '../../../../../helpers/utils';

function toArray(fileList) {
  return Array.prototype.slice.call(fileList);
}

class EasyGaleryUpload extends Component {
  constructor({ data }) {
    super({ data });
    this.data = {
      images: data,
    };
  }

  static get toolbox() {
    return {
      icon:
        '<svg id="svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="400.1624035728786" viewBox="0, 0, 400,400.1624035728786"><g id="svgg"><path id="path0" d="M192.727 0.163 C 70.451 4.932,-18.637 116.128,3.346 236.541 C 18.421 319.111,84.728 384.058,167.654 397.479 C 259.703 412.377,349.116 362.591,384.985 276.467 C 399.220 242.288,403.545 203.014,397.160 165.895 C 380.235 67.504,292.375 -3.723,192.727 0.163 M198.795 91.548 C 199.967 92.240,199.974 92.140,198.237 99.943 C 193.719 120.236,194.382 129.957,201.655 150.125 C 203.173 154.334,203.462 155.025,219.932 193.829 C 238.775 238.223,238.855 238.442,240.135 249.289 C 241.573 261.471,239.490 271.255,233.565 280.146 C 229.396 286.401,220.160 295.340,207.830 305.054 C 202.470 309.277,202.531 309.243,201.375 308.645 C 200.120 307.996,200.120 307.997,201.860 300.213 C 204.329 289.162,204.535 287.619,204.542 280.065 C 204.551 269.774,203.106 262.752,198.239 249.445 C 196.783 245.463,196.652 245.152,180.070 206.090 C 161.461 162.256,161.341 161.929,160.022 151.360 C 158.448 138.752,160.699 128.353,166.967 119.279 C 170.817 113.704,180.678 104.249,191.888 95.383 C 197.669 90.812,197.607 90.846,198.795 91.548 M126.644 114.011 C 127.754 114.688,127.751 114.794,126.490 120.422 C 123.104 135.529,123.375 143.030,127.793 156.476 C 129.571 161.887,130.044 163.041,143.039 193.666 C 158.281 229.588,158.677 230.670,159.660 239.139 C 161.570 255.594,156.080 265.660,136.696 281.243 C 129.797 286.790,129.785 286.797,128.711 286.093 C 127.697 285.429,127.703 285.310,129.048 279.320 C 132.606 263.473,132.013 255.369,126.108 239.139 C 125.588 237.710,119.517 223.231,112.617 206.963 C 96.258 168.391,96.135 168.032,95.409 156.719 C 94.996 150.292,97.181 142.389,100.976 136.581 C 103.955 132.022,111.295 124.846,120.466 117.527 C 125.652 113.388,125.636 113.397,126.644 114.011 M271.127 113.913 C 272.451 114.467,272.449 114.565,270.978 121.165 C 267.782 135.496,268.122 143.431,272.497 156.645 C 274.383 162.343,274.769 163.282,288.462 195.534 C 302.881 229.496,303.304 230.658,304.269 238.967 C 306.288 256.350,300.836 265.816,278.685 283.386 C 274.461 286.735,274.178 286.857,273.049 285.799 C 272.421 285.210,272.462 284.813,273.741 279.091 C 276.990 264.561,276.673 256.840,272.284 243.589 C 270.418 237.959,269.659 236.106,256.788 205.809 C 245.440 179.100,244.675 177.238,243.139 172.598 C 238.338 158.101,239.141 146.460,245.624 136.581 C 248.868 131.638,256.107 124.612,265.959 116.845 C 270.173 113.523,270.181 113.518,271.127 113.913 " stroke="none" fill="#151CCC" fill-rule="evenodd"></path></g></svg>',
      title: 'Image Gallery',
    };
  }

  async uploadFiles(files) {
    let newImg = this.data.images;
    if (typeof newImg[0] === 'undefined') newImg = [];
    const output = document.getElementById('result');

    await asyncForEach(toArray(files), async file => {
      const loader = document.createElement('div');
      loader.classList.add('col-4');
      loader.innerHTML = `<div class="spinner-border text-secondary m-5" height="50" width="50" />`;
      output.insertBefore(loader, null);

      uploadFile(file, {}).then(res => {
        newImg.push(res);
        const div = document.createElement('div');
        div.classList.add('col-4');

        div.innerHTML = `<img class="img-fluid" src="${res.url}"/>`;

        output.insertBefore(div, null);
        loader.parentNode.removeChild(loader);
      });
    });
    this.data.images = newImg;
  }

  save() {
    return Object.assign(this.data, {
      images: this.data.images,
    });
  }

  render() {
    const div = document.createElement('DIV');

    ReactDOM.render(
      <>
        <Button variant="contained" color="secondary" component="label">
          Click to upload images
          <input
            multiple
            type="file"
            accept="image/*"
            className="d-none"
            onChange={event => this.uploadFiles(event.target.files)}
          />
        </Button>
        <div className="container pt-2">
          <div id="result" className="row" />
        </div>
      </>,
      div,
    );

    return div;
  }
}

export default EasyGaleryUpload;
