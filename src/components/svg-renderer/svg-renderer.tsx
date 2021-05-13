import { Component, Prop, h, Event, EventEmitter, Element, Method } from '@stencil/core';
import { SVGAssignData, SVGElementWithData } from '../../interfaces/interfaces';

@Component({
  tag: 'svg-renderer',
  styleUrl: 'svg-renderer.css',
  shadow: true,
})
export class SvgRenderer {

  @Element() el: HTMLElement;

  @Prop() svg: string;
  @Prop() svgAssignDatas: Array<SVGAssignData<any>>;
  @Prop() selectorType: string = "group";
  @Prop() skippableTags: Array<string>;
  @Prop() ownStyle: string = "";

  @Event() rendered: EventEmitter<SVGSVGElement>;
  @Event() imageAddedToSvg: EventEmitter<any>;
  @Event() svgFilled: EventEmitter<SVGSVGElement>;
  @Event() elementClick: EventEmitter<SVGElementWithData>;

  @Method()
  async getData() {
    return this.svgAssignDatas;
  }

  componentDidRender() {
    if (this.svgAssignDatas) {
      this.addImageToSvg()
    }
    const svg = this.el.shadowRoot.querySelector('svg')
    this.rendered.emit(svg);
  }

  private fillSvg (): void {
    let elements = null

    if (this.selectorType === 'group') {
      // select all groups
      elements = Array.from(this.el.shadowRoot.querySelectorAll('svg > g'))
    } else {
      // select all selector
      elements = Array.from(this.el.shadowRoot.querySelectorAll(`svg > ${this.selectorType}`))
    }

    // select style tag
    const style = this.el.shadowRoot.querySelector('svg > defs > style')
    // delete -  fill: none; - rules
    style.innerHTML = style.innerHTML.split('fill: none;').join('')
    style.innerHTML = style.innerHTML.split('fill:none;').join('')
    style.innerHTML += this.ownStyle;
    this.el.shadowRoot.querySelector('.svgStyle').innerHTML = style.innerHTML
    style.remove();

    elements.forEach((element: SVGSVGElement) => {
      element.setAttribute('pointerEvent', 'visible');
      const svgAssignData = this.svgAssignDatas.find((data: SVGAssignData<any>) => {
        return data.part.selector === `#${element.id}`
      })

      let fillValue = '#FFFFFF'

      if (svgAssignData && (svgAssignData.color || svgAssignData.image)) {
        if (this.skippableTags.includes(element.id.toLowerCase())) {
          fillValue = 'none'
        } else if (!svgAssignData.isImage && svgAssignData.color.colorCode.startsWith('#')) {
          fillValue = svgAssignData.color.colorCode
        } else if (!svgAssignData.isImage && !svgAssignData.color.colorCode.startsWith('#')) {
          fillValue = '#FFFFFF'
        } else {
          fillValue = `url(#${svgAssignData.image.imageId})`
        }
      } else {
        fillValue = 'transparent'
      }

      element.setAttribute('fill', fillValue)

      this.addEventListenerToElement(element)
    })
    const coloredSvg = this.el.shadowRoot.querySelector('svg')
    this.svgFilled.emit(coloredSvg)
  }

  private addImageToSvg () {
    let hasImage = false
    this.svgAssignDatas.forEach((svgAssignData: SVGAssignData<any>) => {
      if (svgAssignData.isImage) {
        hasImage = true
        const defs = this.el.shadowRoot.querySelector('svg > defs');
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        const canvas = document.createElement('canvas')
        const img = new Image(svgAssignData.outputImageSize.width, svgAssignData.outputImageSize.height)
        img.onload = () => {
          canvas.width = svgAssignData.canvasSize.width
          canvas.height = svgAssignData.canvasSize.height
          canvas.getContext('2d').drawImage(img, 0, 0, svgAssignData.canvasSize.width, svgAssignData.canvasSize.height)

          image.setAttribute('href', canvas.toDataURL())
          image.setAttribute('x', '0')
          image.setAttribute('y', '0')
          image.setAttribute('width', svgAssignData.canvasSize.width.toString())
          image.setAttribute('height', svgAssignData.canvasSize.height.toString())

          node.id = svgAssignData.image.imageId.toString()
          node.setAttribute('width', svgAssignData.canvasSize.width.toString())
          node.setAttribute('height', svgAssignData.canvasSize.height.toString())
          node.setAttribute('patternUnits', 'userSpaceOnUse')
          
          node.appendChild(image)
          defs.appendChild(node)

          this.imageAddedToSvg.emit()

          this.fillSvg()
        }
        img.src = svgAssignData.image.imageName
      }
    })
    if (!hasImage) this.fillSvg()
  }

  private addEventListenerToElement (element: SVGSVGElement): void {
    element.addEventListener('click', () => {
      if(!this.skippableTags.includes(element.id.toLowerCase())) {
        this.elementClick.emit({svgsvgelement: element, data: this.svgAssignDatas.find(d => d.part.selector === element.id)})
      }
    })
  }

  render() {
    return (<div>
      <style class="svgStyle"></style>
      <div innerHTML={this.svg}></div>
    </div>);
  }
}
