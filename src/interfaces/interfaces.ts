export interface Color {
    colorCode: string;
  }
  
  export interface Image {
    imageName: string;
    imageId: number;
  }
  
  export interface SvgPart {
    selector: string;
  }
  
  export interface ImageSize {
    width: number;
    height: number;
  }
  
  export interface SVGAssignData<T> {
    data?: T;
    color?: Color;
    image?: Image;
    part: SvgPart;
    isImage: boolean;
    outputImageSize: ImageSize;
    canvasSize: ImageSize;
  }
  
  export interface SvgColorer {
    svg: string;
    assignableData: Array<SVGAssignData<any>>;
    skippableSelectors: Array<string>;
  }

  export interface SVGElementWithData {
    svgsvgelement: SVGSVGElement,
    data: SVGAssignData<any>
  }