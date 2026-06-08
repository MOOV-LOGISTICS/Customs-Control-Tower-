/**
 * 图表工具函数
 */

// 显示加载状态
export function showLoading(chartInstance) {
  if (!chartInstance) return
  
  chartInstance.setOption({
    title: {
      text: 'Loading Data...',
      left: 'center',
      top: 'center',
      textStyle: {
        color: '#999',
        fontSize: 16
      }
    },
    series: []
  })
}

// 显示无数据状态
export function showNoData(chartInstance) {
  if (!chartInstance) return
  
  chartInstance.setOption({
    title: {
      text: 'No data available',
      left: 'center',
      top: 'center',
      textStyle: {
        color: '#999',
        fontSize: 16
      }
    },
    series: []
  })
}

// 格式化状态数据
export function formatStatusData(dataMap, statusList) {
  if (!dataMap || Object.keys(dataMap).length === 0) return []
  
  return Object.entries(dataMap).map(([value, vo]) => {
    const statusItem = statusList.find(item => item.value === value)
    const name = statusItem ? statusItem.label : `Unknown (${value})`
    return {
      name,
      count: vo.count,
      value: parseFloat(vo.percentage.toFixed(2))
    }
  })
}

// 格式化通用数据
export function formatData(dataMap) {
  if (!dataMap || Object.keys(dataMap).length === 0) return []
  
  return Object.entries(dataMap).map(([name, vo]) => ({
    name,
    count: vo.count,
    value: parseFloat(vo.percentage.toFixed(2))
  }))
}

// 获取柱状图配置
export function getBarOption(title, data, colors) {
  const isEmpty = !data || data.length === 0

  const defaultColors = [
    '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', 
    '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#FF9F7F'
  ]
  colors = colors || defaultColors

  const baseOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: isEmpty ? '#999' : '#333'
      }
    },
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: params => {
        const param = params[0]
        return `
          <div style="font-weight:bold">${param.name}</div>
          <div>Percentage: ${param.value}%</div>
          <div>Count: ${param.data.count}</div>
        `
      }
    },
    grid: {
      bottom: 40
    },
    xAxis: {
      type: 'category',
      data: isEmpty ? [] : data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30,
        width: 80,
        overflow: 'truncate',
        ellipsis: '...'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Percentage (%)',
      max: 100
    }
  }

  if (isEmpty) {
    return {
      ...baseOption,
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '45%',
            style: {
              text: '📊',
              fontSize: 50,
              fill: '#eee'
            }
          }
        ]
      },
      series: []
    }
  }

  return {
    ...baseOption,
    series: [
      {
        name: title.split(' ')[0],
        type: 'bar',
        data: data.map(item => ({
          value: item.value,
          count: item.count,
          name: item.name,
          itemStyle: {
            color: colors[data.indexOf(item) % colors.length]
          }
        })),
        label: {
          show: true,
          position: 'top',
          formatter: params => {
            return `${params.value}% (${params.data.count})`
          }
        },
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}

// 获取模块图表配置
export function getModuleChartOption(title, data, colors) {
  const isEmpty = !data || data.length === 0

  const defaultColors = [
    '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', 
    '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#FF9F7F'
  ]
  colors = colors || defaultColors

  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: isEmpty ? '#999' : '#333'
      }
    },
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: params => {
        const param = params[0]
        return `
          <div style="font-weight:bold">${param.name}</div>
          <div>Percentage: ${param.value}%</div>
          <div>Count: ${param.data.count}</div>
        `
      }
    },
    grid: {
      bottom: 40
    },
    xAxis: {
      type: 'category',
      data: isEmpty ? [] : data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 0,
        width: 100,
        overflow: 'truncate',
        ellipsis: '...'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Percentage (%)',
      max: 100
    },
    series: isEmpty
      ? []
      : [
        {
          name: title.split(' ')[0],
          type: 'bar',
          barWidth: '60%',
          data: data.map(item => ({
            value: item.value,
            count: item.count,
            name: item.name,
            itemStyle: {
              color: colors[data.indexOf(item) % colors.length]
            }
          })),
          label: {
            show: true,
            position: 'top',
            formatter: params => {
              return `${params.value}% (${params.data.count})`
            }
          },
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
  }

  if (isEmpty) {
    option.graphic = {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: '45%',
          style: {
            text: '📊',
            fontSize: 50,
            fill: '#eee'
          }
        }
      ]
    }
  }

  return option
}