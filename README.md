# sparkar-admin-panel
A simple, TouchGesture based, approach at hiding content not relevant to a user

## Disclaimer
> This techincally doesn't follow the guidelines. Use at your own discretion. I do not encourage you to publish effects that do not adhere to the guidelines/policies
> 
> ["1.2. Functionality. Effects must not contain any hidden or unexpected features or functionality."](https://sparkar.facebook.com/ar-studio/learn/publishing/spark-ar-review-policies)

## Example
```typescript
import NativeUI from 'NativeUI';
import Patches from 'Patches';
import { AdminPanel, TAP, LONG_PRESS, PAN } from './adminPanel';

const ScreenSize = CamInfo.previewSize;

// A user would have to tap -> long press -> pan in a clockwise fashion 👇
const AP = AdminPanel({
    password: [TAP, LONG_PRESS, PAN],
    panQuadrantPath: [0,1,3,2]
    // 0 - 1
    // |   |
    // 2 - 3
});

// If the "password" is inputted correctly, then... 👇
AP.then(async ()=>{
    NativeUI.slider.visible = true;
    Patches.inputs.setScalar('secret-setting', NativeUI.slider.value);
});
```

## Looking for use cases?
- Showing extra settings
- Displaying NativeUI
- Dynamically instancing blocks
  - (Said blocks may have 2dText that displays information relevant to the creator)

## RoadMap:
- Adding a Timeout if the password is not correct
- Saving a token after the password is inputted correctly, giving a few minutes of access, before invalidating itself
- Support for the rotate gesture (?)
