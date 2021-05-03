import { Component, h, Prop, State } from '@stencil/core';
import { Color, SVGAssignData, Image } from '../../interfaces/interfaces';

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

  @State() selected: SVGSVGElement;

  onClicked(element: CustomEvent<SVGSVGElement>) {
    if(!this.selected) {
      this.selected = element.detail;
      this.selected.style.strokeWidth = "2";
    }
    if(this.selected !== element.detail) {
      this.selected.style.strokeWidth = "1";
      this.selected = element.detail;
      this.selected.style.strokeWidth = "2";
    }
  }

  onColorClick(e: Color) {
    this.selected.style.fill = e.colorCode;
  }

  onImageClick(e: Image) {
    this.selected.style.fill = e.imageName;
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
