import TouchGestures from 'TouchGestures';
import CamInfo from 'CameraInfo';
import Reactive from 'Reactive';

export const TAP = 1;
export const LONG_PRESS = 2;
export const PAN = 3;

export function AdminPanel(
    { password = [TAP, TAP, LONG_PRESS], panQuadrantPath }:
    { password: number[], panQuadrantPath: number[] }
    ){
        if (password.indexOf(PAN) !== -1 && !panQuadrantPath) {
            throw `@ AdminPanel: panRotateDef is not defined, attempted to use PAN as part of the password`;
        };

        if (password.indexOf(TAP) !== -1 && !TouchGestures.onTap) throw `The TapGestures.TAP capability is not enabled`
        if (password.indexOf(LONG_PRESS) !== -1 && !TouchGestures.onTap) throw `The TapGestures.LONG_PRESS capability is not enabled`
        if (password.indexOf(PAN) !== -1 && !TouchGestures.onTap) throw `The TapGestures.PAN capability is not enabled`

        return new Promise(resolve=>{
            let gesturesArr: number[] = [];

            if (password.indexOf(TAP) !== -1)
            TouchGestures.onTap().subscribe(()=>{
                gesturesArr.push(TAP);
                evalGestures();
            });

            if (password.indexOf(LONG_PRESS) !== -1)
            TouchGestures.onLongPress().subscribe(()=>{
                gesturesArr.push(LONG_PRESS);
                evalGestures()
            });

            if (password.indexOf(PAN) !== -1)
            TouchGestures.onPan().subscribe((pan: PanGesture)=>{
                const l = pan.location.sub(CamInfo.previewSize.div(2)).sign().add(1) as unknown as Vec2Signal;
                let quadrants: number[] = [];

                const sub = Reactive.monitorMany({
                    x: l.x,
                    y: l.y
                }, {fireOnInitialValue: true}).select('newValues').subscribe((vals: {x: number, y: number})=>{
                    if (vals.x == 1 || vals.y == 1) return;
                    // 0 - 1     00   10
                    // |   |
                    // 2 - 3     01   11
                    if (quadrants.length >= panQuadrantPath.length && (quadrants+'' === panQuadrantPath+'')) {
                        gesturesArr.push(PAN);
                        evalGestures();
                    } else if (quadrants.length >= panQuadrantPath.length) {
                        quadrants = [];
                        sub.unsubscribe();
                    }

                    if (!vals.x && !vals.y) quadrants.push(0);
                    if (vals.x && !vals.y)  quadrants.push(1);
                    if (!vals.x && vals.y)  quadrants.push(2);
                    if (vals.x && vals.y)   quadrants.push(3);
                });
            });

            function evalGestures(){
                if (gesturesArr+'' == password+''){
                    resolve(undefined);
                };
            };

        });
};
