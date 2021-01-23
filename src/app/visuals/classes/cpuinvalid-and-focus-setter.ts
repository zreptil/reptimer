import {Renderer2} from '@angular/core';

/*
Problem: Durch den Focus- sowie Invalid-Rahmen verändernt Control minimal seine
Größe, was die Elemente in den Zeilen darunter "springen" lässt. Das Setzen
der Höhe hat keinen Effekt, solange die position nicht auf relative + absolute
gesetzt wird. Sobald dies jedoch geschieht, rutschen die nachfolgenden Zeilen
über das Control. Kommt ein Rahmen hinzu und passten die Zeilen gerade noch so
in den alten Rahmen, werden die Zeilen nun (durch den geringfügig dickeren
neuen Rahmen) zu kurz und werden mehrzeilig, was die nachfolgenden Zeilen noch
mehr verschiebt.

Lösung: Vier div-Objekte, jeder von denen ist für einen Teil des Rahmens zuständig,
die absolut genau über dem mat-card-Objekt positioniert werden. Deren Rahmen
beeinflusst nicht den Inhalt des optisch darunter liegenden mat-card-Objekts.

Leider erwische ich den richtigen Zeitpunkt, wo die Höhe des von .mat-card-frame
bereits berechnet wurde, aber noch nicht gezeichnet wurde nicht.
Daher wird die Höhe des .inner erst in onFocus() gesetzt.


@example
class MyCustomControl ... {
               private focusHandler = new CPUInvalidAndFocusSetter(() => this.widget.nativeElement,
                                                                   () => this.isValid(),
                                                                   () => this.renderer);

               constructor(private widget: ElementRef,
               private renderer: Renderer2) {
                 // ...
               }

               ngAfterViewInit(): void {
                 this.focusHandler.afterViewInit();
               }

               private isValid(): boolean {
                 const widget = this.widget.nativeElement;
                 return !widget.querySelector('[ng-reflect-required="true"]')
                        || widget.querySelector('mat-radio-button.mat-radio-checked');
               }

               ngOnInit(): void {
                 // optional; only if you wish to perform some specific event actions
                 this.focusHandler.onFocusinFn = ev => doSomethingOnFocusin(ev);
                 this.focusHandler.onFocusoutFn = ev => doSomethingOnFocusout(ev);
                 this.focusHandler.onClickFn = ev => doSomethingOnClick(ev);
                 this.focusHandler.onKeydownFn = ev => doSomethingOnKeydown(ev);
               }

               private doSomethingOnFocusin(ev): void {}
               private doSomethingOnFocusout(ev): void {}
               private doSomethingOnClick(ev): void {}
               private doSomethingOnKeydown(ev): void {}
}

 */
export class CPUInvalidAndFocusSetter {

  private cssClassInFocus = 'cpu-focus';
  private cssClassInvalid = 'cpu-invalid';
  private frames = ['top', 'bottom', 'left', 'right'];
  private firstRun = true;
  private _onFocusin = ev => {};
  private _onFocusout = ev => {};
  private _onClick = ev => {};
  private _onKeydown = ev => {};

  public constructor(private getWidget: () => any,
                     private isValid: () => boolean,
                     private getRenderer: () => Renderer2) {

  }

  // falls der Client zusätzliche Bearbeitung wünscht
  public set onFocusinFn(fn) {
    this._onFocusin = fn || (ev => {});
  }

  // falls der Client zusätzliche Bearbeitung wünscht
  public set onFocusoutFn(fn) {
    this._onFocusout = fn || (ev => {});
  }

  // falls der Client zusätzliche Bearbeitung wünscht
  public set onClickFn(fn) {
    this._onClick = fn || (ev => {});
  }

  // falls der Client zusätzliche Bearbeitung wünscht
  public set onKeydownFn(fn) {
    this._onKeydown = fn || (ev => {});
  }

  afterViewInit(): void {
    const inner = this.getWidget().querySelector('.inner');
    if (inner) {
      this.frames.forEach(name => {
        const frame = document.createElement('div');
        frame.className = `cpu-frame-${name}`;
        inner.appendChild(frame);
      });

      const root = this.getFocusRoot();
      if (root) {
        this.getRenderer().listen(root, 'click', ev => this.onClick(ev));
        this.getRenderer().listen(root, 'keydown', ev => this.onKeydown(ev));
        this.getRenderer().listen(root, 'focusin', ev => this.onFocus(ev));
        this.getRenderer().listen(root, 'focusout', ev => this.onBlur(ev));
      }
    }
  }

  getFocusRoot(): any {
    return this.getWidget().querySelector('mat-card');
  }

  onFocus(ev): void {
    if (this.firstRun) {
      this.firstRun = false;
      this.initFrame();
    }

    this.setInValid();
    this.addFrameCssClass(this.cssClassInFocus);

    this._onFocusin(ev);
  }

  private initFrame(): void {
    const matCardFrame = this.getWidget().querySelector('.mat-card');
    const styleMatCardFrame = getComputedStyle(matCardFrame);
    const pxHeight = Number.parseInt(styleMatCardFrame.height);
    const pxWidth = Number.parseInt(styleMatCardFrame.width);

    const top = this.getFrame('top');
    top.style.width = `${pxWidth}px`;

    const bottom = this.getFrame('bottom');
    bottom.style.width = `${pxWidth}px`;
    bottom.style.top = `${pxHeight - Number.parseInt(getComputedStyle(bottom).height)}px`;

    const left = this.getFrame('left');
    left.style.height = `${pxHeight}px`;

    const right = this.getFrame('right');
    right.style.height = `${pxHeight}px`;
    right.style.left = `${pxWidth - Number.parseInt(getComputedStyle(right).width)}px`;
  }

  private getFrame(name): any {
    return this.getWidget().querySelector(`.cpu-frame-${name}`);
  }

  private addFrameCssClass(className: string): void {
    this.frames.forEach(frame => this.getRenderer().addClass(this.getFrame(frame), className));
  }

  private removeFrameCssClass(className: string): void {
    this.frames.forEach(frame => this.getRenderer().removeClass(this.getFrame(frame), className));
  }

  onBlur(ev): void {
    const focusRoot = this.getFocusRoot();
    this.removeFrameCssClass(this.cssClassInFocus);
    this.setInValid();

    this._onFocusout(ev);
  }

  onClick(ev): void {
    this.setInValid();

    this._onClick(ev);
  }

  onKeydown(ev): void {
    if (ev) {
      switch (ev.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          // TODO(LyMe): beachte, es kann auch invalid value ausgewählt sein. Impelment This!
          this.setInValid();
          break;
      }

      this._onKeydown(ev);
    }
  }

  private setInValid(): void {
    if (this.isValid()) {
      this.getRenderer().removeClass(this.getFocusRoot(), this.cssClassInvalid);
      this.removeFrameCssClass(this.cssClassInvalid);
    } else {
      this.getRenderer().addClass(this.getFocusRoot(), this.cssClassInvalid);
      this.addFrameCssClass(this.cssClassInvalid);
    }
  }

}
