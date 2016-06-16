declare module pv {

  function Viewer(element: HTMLElement, options?: ViewerOptions): Viewer;

  namespace color {
    function hex2rgb(color: string): number[];

    class Gradient {
      constructor(color: string, stops: number);
      colorAt(): number[];
    }
    function gradient(color: string | number[], stops?: string | number[]): Gradient;

    class ColorOp {
      constructor(
        colorFunc: (atom: mol.Atom, out: number[], index: number) => void,
        beginFunc: Function,
        endFunc: Function
      );
    }

    // Built-in coloring operations
    function uniform(color?: string | number[]): ColorOp;
    function byElement(): ColorOp;
    function byChain(gradient?: Gradient): ColorOp;
    function ssSuccession(gradient?: Gradient, color?: string | number[]): ColorOp;
    function bySS(): ColorOp;
    function rainbow(gradient?: Gradient): ColorOp;
    function byAtomProp(prop: string, gradient?: Gradient, range?: number[]): ColorOp;
    function byResidueProp(prop: string, gradient?: Gradient, range?: number[]): ColorOp;
  }

  namespace io {
    function pdb(pdbData: string, options?: any): mol.Mol;
  }

  namespace mol {
    class Mol {
      chains(): Chain[];
      addChain(name: string): Chain;
      createEmptyView(): mol.MolView;
    }
    class MolView {
      constructor(mol: Mol);
      chains(): ChainView[];
      addChain(chain: Chain, recurse: boolean): ChainView;
      addAtom(atom: Atom): AtomView;
      full(): Mol;
    }
    class Chain {
      residues(): Residue[];
      name(): string;
      structure(): Mol;
      addResidue(name: string, num: number, insCode?: string): Residue;
    }
    class ChainView {
      residues(): ResidueView[];
      name(): string;
      addResidue(residue: Residue, recurse: boolean): ResidueView;
    }
    class Residue {
      atoms(): Atom[];
      name(): string;
      num(): number;
      ss(): string;
      chain(): Chain;
      addAtom(name: string, pos: number[], element: string, isHetatm?: boolean, occupancy?: number, tempFactor?: number): Atom;
      isAminoacid(): boolean;
    }
    class ResidueView {
      atoms(): AtomView[];
      name(): string;
      num(): number;
      ss(): string;
      addAtom(atom: Atom, checkDuplicates?: boolean): AtomView;
      isAminoacid(): boolean;
    }
    class Atom {
      name(): string;
      element(): string;
      residue(): Residue;
    }
    class AtomView {
      name(): string;
    }
  }

  interface Viewer {
    spheres(name: string, structure: mol.Mol | mol.MolView, options?: RenderOptions): Geometry;
    cartoon(name: string, structure: mol.Mol | mol.MolView, options?: RenderOptions): Geometry;
    renderAs(name: string, structure: mol.Mol | mol.MolView, mode: string, options?: RenderOptions): Geometry;

    on(type: string, callback: ViewerReadyCallback | ViewerClickCallback): void;

    add(name: string, obj: Geometry): Geometry;
    get(name: string): Geometry;
    hide(name: string): void;
    show(name: string): void;
    rm(name: string): void;

    autoZoom(): void;
    fitTo(what: mol.MolView | mol.MolView[], animationTime?: number): void;
    fitParent(): void;
    requestRedraw(): void;

    ok(): boolean;
    boundingClientRect(): ClientRect;
    pick(pos: ViewerPosition): ViewerPick;

    center(): Float32Array;
    rotation(): Float32Array;
    zoom(): number;
    setCamera(rotation: Float32Array, center: Float32Array, zoom: number): void;
  }

  interface ViewerOptions {
    width?: number | string;
    height?: number | string;
    antialias?: boolean;
    quality?: string;
    slabMode?: string;
    background?: string | number[];
    selectionColor?: string | number[];
    atomDoubleClicked?: Function | string;
    atomClicked?: Function;
    animateTime?: number;
    fog?: boolean;
    fov?: number;
    outline?: boolean;
    outlineColor?: string | number[];
    outlineWidth?: number;
  }

  // viewerReady
  interface ViewerReadyCallback {
    (viewer: Viewer): void;
  }

  // click and doubleClick
  interface ViewerClickCallback {
    (picked: ViewerPick, event: MouseEvent): void;
  }

  interface ViewerPick {
    object(): {geom: Geometry, atom: mol.Atom};
    pos(): ViewerPosition;
  }

  interface ViewerPosition {
    x: number;
    y: number;
  }

  interface RenderOptions {
    // general
    color?: color.ColorOp;
    // ballsAndSticks
    cylRadius?: number;
    sphereRadius?: number;
    scaleByAtomRadius?: boolean;
    // cartoon
    radius?: number;
    arcDetail?: number;
    strength?: number;
    splineDetail?: number;
    // spheres
    sphereDetail?: number;
  }

  interface Geometry {
    colorBy(coloring: color.ColorOp, selection?: mol.MolView): void;
    getColorForAtom(atom: mol.Atom | mol.AtomView, color: number[]): void;
    name(): string;
    structure(): mol.Mol;
    selection(): mol.MolView;
    setSelection(selection: mol.MolView): void;
    setOpacity(opacity: number): void;
  }

}
