![pimp-pimp-156107936732134](https://user-images.githubusercontent.com/566971/59890663-4c92f900-93a8-11e9-8ff5-10d3ebb0af88.gif)

```js
// src/App.js
import WealthyEditor from 'wealthy-text-editor'

const handleImageUpload = async file => {
  const imgUrl = await uploadToMyServer(file)
  return imgUrl
}

export default props => (
  <WealthyEditor
    onImageUpload={handleImageUpload}
    counter
    onChange={console.log}
    initialText={text}
  />
)
```
