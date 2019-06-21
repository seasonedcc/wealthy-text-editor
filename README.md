![pimp-pimp-156114760187876](https://user-images.githubusercontent.com/566971/59948615-0345b680-9447-11e9-974c-87d35a65a676.gif)

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
