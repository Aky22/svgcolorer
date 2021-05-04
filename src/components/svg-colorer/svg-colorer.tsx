import { Component, h, Prop, State, Method } from '@stencil/core';
import { Color, SVGAssignData, Image, SVGElementWithData } from '../../interfaces/interfaces';

@Component({
  tag: 'svg-colorer',
  styleUrl: 'svg-colorer.css',
  shadow: true,
})
export class SvgColorer {

  @Prop() colors: Array<Color>;
  @Prop() images: Array<Image>;

  @Prop() svg: string;
  @Prop() skippableTags: Array<string>;
  @Prop() selectorType: string = "group";
  @Prop() svgAssignDatas: Array<SVGAssignData<any>>;

  @State() selected: SVGElementWithData;

  @Method()
  async getData() {
    return this.svgAssignDatas;
  }

  onClicked(element: CustomEvent<SVGElementWithData>) {
    if(!this.selected) {
      this.selected = element.detail;
      this.selected.svgsvgelement.style.strokeWidth = "2";
    }
    if(this.selected !== element.detail) {
      this.selected.svgsvgelement.style.strokeWidth = "1";
      this.selected = element.detail;
      this.selected.svgsvgelement.style.strokeWidth = "2";
    }
  }

  onColorClick(e: Color) {
    this.selected.svgsvgelement.style.fill = e.colorCode;
    this.selected.data.color.colorCode = e.colorCode;
  }

  onImageClick(e: Image) {
    this.selected.svgsvgelement.style.fill = e.imageName;
    this.selected.data.image.imageName = e.imageName;
    this.selected.data.image.imageId = e.imageId;
  }

  render() {
    return (
      <div class="row">
        <div class="col">
        <svg-renderer
          onElementClick={element => this.onClicked(element)}
          svg={this.svg} 
          skippableTags={this.skippableTags} 
          selectorType={this.selectorType} 
          svgAssignDatas={this.svgAssignDatas}>
        </svg-renderer>
        </div>
        <div class="col">
          <div class="row">
            <div class="col">
              {this.colors.map((c, index) => 
                  <div key={index} class="circle" style={{backgroundColor: c.colorCode}} onClick={() => this.onColorClick(c)}></div>
              )}
            </div>
          </div>
          <div class="row">
            <div class="col">
              {this.images.map((img, index) => {
                <div key={index} class="circle" style={{backgroundImage: `url(${img.imageName})`}} onClick={() => this.onImageClick(img)}></div>
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
