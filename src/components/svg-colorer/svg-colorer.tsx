import { Component, h, Prop, State } from '@stencil/core';
import { Color, SVGAssignData, Image } from '../../interfaces/interfaces';

@Component({
  tag: 'svg-colorer',
  styleUrl: 'svg-colorer.css',
  shadow: true,
})
export class SvgColorer {

  @Prop() colors: Array<Color> = [{colorCode: "#FF0000", colorId: 1}, {colorCode: "#0000FF", colorId: 2}];
  @Prop() images: Array<Image>;

  @Prop() svg: string;
  @Prop() skippableTags: Array<string> = ['tűzés', 'díszítés', 'lyukasztás', 'cúg'];
  @Prop() selectorType: string = "group";
  @Prop() svgAssignDatas: Array<SVGAssignData<any>> = [{
    color: {
      colorCode: '#123456',
      colorId: 1
    },
    isImage: false,
    part: {
      selector: '#_4'
    },
    outputImageSize: {
      width: 800,
      height: 800
    },
    canvasSize: {
      width: 800,
      height: 800
    }
  }]

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
            {this.colors.map((c) => 
              <div key={c.colorId} class="col">
                <div class="circle" style={{backgroundColor: c.colorCode}} onClick={() => this.onColorClick(c)}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

}
