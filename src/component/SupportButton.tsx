import React, { useState, useEffect } from 'react'

const SupportButton = (): JSX.Element => {
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    fetch('image/icon/bmc-full-logo-themed.svg')
      .then((res) => res.text())
      .then(setSvg)
  }, [])

  return <span aria-label="Buy me a coffee!" dangerouslySetInnerHTML={{ __html: svg }} />
}

export default SupportButton
