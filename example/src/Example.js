import React, { useState, useEffect } from 'react'
import WealthyEditor from 'wealthy-text-editor'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism'
import { Card, CardHeader, CardContent } from '@material-ui/core'

const Example = () => {
  const [config, setConfig] = useState({
    apiKey: process.env.REACT_APP_API_KEY,
    storageBucket: process.env.REACT_APP_BUCKET,
  })
  useEffect(() => {
    if (!config.apiKey || !config.storageBucket) {
      const apiKey = prompt('Please enter your Firebase API key')
      const storageBucket = prompt('Please enter your Storage Bucket')
      setConfig({ apiKey, storageBucket })
    }
  }, [config.apiKey, config.storageBucket])

  return (
    <Card elevation={4} style={{ overflow: 'visible' }}>
      <CardHeader title="WealthyEditor sample" />
      <CardContent>
        <WealthyEditor
          config={config}
          uploodsMaxDimension={400}
          uploodsOverwrite
          counter
          onChange={console.log}
          initialText={text}
        />
      </CardContent>
      <SyntaxHighlighter language="javascript" style={prism}>
        {`
  import WealthyEditor from 'wealthy-text-editor'

  <WealthyEditor
    counter
    config={{ apiKey: 'MyFirebaseKey', storageBucket: 'MyBucket' }}
    uploodsOverwrite
    uploodsMaxDimension={400}
    uploodsPrefix="some-folder/user-profiles"
    onChange={console.log}
    initialText="<h1>How a Rare..."
  />
              `}
      </SyntaxHighlighter>
    </Card>
  )
}

const text = `
<h1>How a Rare Solar <em>‘Superflare’</em> Could Cripple Humanity</h1><h2>Our networked, electrified society makes us uniquely vulnerable to the effects of sudden solar weather</h2><p><br></p><p>Life on Earth wouldn’t be possible without the steady shine of our sun, but every now and again, it flares up, at times so strongly it disrupts cell phone calls, knocks a satellite or two silly, trips a power grid, even in one extreme case, starts fires. But in modern times at least, the sun hasn’t yet erupted in a <em>superflare</em> — the kind of colossal cosmic disturbance scientists have detected emanating from sun-like stars elsewhere in the galaxy.</p>
`

export default Example
