class TableGroup {
  tableList = [];

  constructor (options) {
    options.tableList.forEach((tableOpitons) => {
      this.addTable(tableOpitons)
    })
  }

  addTable (options) {
    const table = new Table(options)
    this.tableList.push(table)
  }

  removeTable (index) {
    this.tableList.splice(index, 1)
  }

  render (h) {
    return h('div', { class: 'table-group' }, this.tableList.map((table) => {
      return table.render(h)
    }))
  }
}

class Table {
  rows = null;
  cols = null;

  constructor (options = {}) {
    this.rows = new Rows(options.rows)
    this.cols = new Cols(options.cols)
  }

  render (h) {
    const hasRowSub = this.rows.specList.some(spec => spec.children.length > 0)
    const hasColSub = this.cols.specList.some(spec => spec.children.length > 0)
    return h('table', null, [
      h('thead', null, [
        h('tr', null, [
          h('th'),
          h('th', null, '父规格'),
          (hasRowSub ? h('th', null, '子规格') : null),
          this.cols.specList.map(spec => {
            return h('th', {
              attrs: { colspan: spec.children.length || 1 }
            }, '添加')
          })
        ])
      ]),
      h('tbody', null, [
        h('tr', null, [
          h('th', null, '父规格'),
          h('td', {
            attrs: { colspan: hasRowSub ? 2 : 1, rowspan: hasColSub ? 2 : 1 }
          }, '规格'),
          this.cols.specList.map(spec => {
            return h('td', {
              attrs: { colspan: spec.children.length || 1 }
            }, spec.value)
          })
        ]),
        h('tr', null, [
          hasColSub ? h('th', null, '子规格') : null,
          this.cols.specList.map(spec => {
            return spec.children.map(subSpec => {
              return h('td', null, subSpec.value)
            })
          })
        ]),
        this.rows.specList.map(spec => {
          return spec.children.map((subSpec, index) => {
            return h('tr', null, [
              index === 0 ? [
                h('td', {
                  attrs: { rowspan: spec.children.length }
                }, '添加'),
                h('td', {
                  attrs: { rowspan: spec.children.length }
                }, spec.value)
              ] : null,
              h('td', null, subSpec.value),
              this.cols.specList.map(spec => {
                return Array(spec.children.length || 1).fill().map(() => {
                  return h('td', null, '待定')
                })
              })
            ])
          })
        })
      ])
    ])
  }
}

class Queue {
  static queueType = ''
  specList = []

  constructor (specList) {
    if (specList && specList.length > 0) {
      specList.forEach((options) => {
        this.addParentSpec(this.specList.length, options)
      })
    }
  }

  addParentSpec (index, options) {
    const spec = new Spec(this.constructor.queueType, options)
    this.specList.splice(index, 0, spec)
  }

  addSubSpec (parentSpec, options) {
    parentSpec.addSubSpec(options)
  }

  removeParentSpec (index) {
    this.specList.splice(index, 1)
  }

  removeSubSpec (parentSpec) {
    parentSpec.children.splice(this.specList.length - 1)
  }

  render () {
  }
}

class Rows extends Queue {
  static queueType = 'rows'
}

class Cols extends Queue {
  static queueType = 'cols'
}

class Spec {
  parent = null
  queueType = ''
  value = ''
  children = []

  constructor (queueType, options) {
    this.queueType = queueType
    this.value = options.value
    if (options.children && options.children.length > 0) {
      options.children.forEach((options) => {
        this.addSubSpec(options)
      })
    }
  }

  addSubSpec (options) {
    const spec = new Spec(this.queueType, options)
    spec.parent = this
    this.children.push(spec)
  }
}

export {
  TableGroup
}
