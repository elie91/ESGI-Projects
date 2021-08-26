import React from 'react'
import ContentLoader from 'react-content-loader'

const GridLoader = ({
  width = 1140,
  row = 3,
  column = 3,
  padding = 15,
  borderRadius = 4,
  ...props
}) => {
  const list = []

  let height;

  if (window.innerWidth < 420){
    column = 1;
    width = 480;
  }

  for (let i = 1; i <= row; i++) {
    for (let j = 0; j < column; j++) {
      const itemWidth = (width - padding * (column + 1)) / column

      const x = ((j > 0) ? padding : 0) + j * (itemWidth + padding)

      const height1 = itemWidth / 1.5

      const height2 = 20

      const height3 = 20

      const space =
        padding + height1 + (padding / 2 + height2) + height3 + padding * 4

      const y1 = padding + padding * 2 + space * (i - 1)

      const y2 = y1 + padding + height1

      const y3 = y2 + padding / 2 + height2

      list.push(
        <React.Fragment key={i+"-"+j}>
          <rect
            x={x}
            y={y1}
            rx={borderRadius}
            ry={borderRadius}
            width={itemWidth}
            height={height1}
          />
          <rect x={x} y={y2} rx={0} ry={0} width={itemWidth} height={height2}/>
          <rect
            x={x}
            y={y3}
            rx={0}
            ry={0}
            width={itemWidth * 0.6}
            height={height3}
          />
        </React.Fragment>
      )

      if (i === row) {
        height = y3 + height3
      }
    }
  }

  return (
    <ContentLoader
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      speed={2}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      {list}
    </ContentLoader>
  )
}

export default GridLoader
