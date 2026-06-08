<template>
  <span v-if="mode === 'text'">{{ label }}</span>
  <el-tag v-else-if="mode === 'tag'" :type="tagType" :effect="tagEffect" :size="tagSize">{{ label }}</el-tag>
  <el-select
    v-else-if="mode === 'select'"
    v-model="selectedValue"
    :clearable="clearable"
    :filterable="filterable"
    :multiple="multiple"
    :placeholder="placeholder"
    :disabled="disabled"
    :size="size"
    :style="{ width: width }"
    v-on="$listeners"
    @change="handleChange"
  >
    <el-option
      v-for="dict in dictOptions"
      :key="dict.value"
      :label="dict.label"
      :value="dict.value"
    />
  </el-select>
</template>

<script>
import { getDictDatas, getDictDataLabel, getDictData } from '@/utils/dict'

export default {
  name: 'BscDictionary',
  props: {
    mode: {
      type: String,
      default: 'text',
      validator: v => ['text', 'tag', 'select'].includes(v)
    },
    dictType: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Array],
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: undefined
    },
    width: {
      type: String,
      default: '100%'
    },
    tagEffect: {
      type: String,
      default: 'light'
    },
    tagSize: {
      type: String,
      default: 'mini'
    }
  },
  computed: {
    label() {
      if (this.value === '' || this.value === null || this.value === undefined) return ''
      return getDictDataLabel(this.dictType, this.value)
    },
    tagType() {
      const dict = getDictData(this.dictType, this.value)
      return dict ? dict.colorType || '' : ''
    },
    selectedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    dictOptions() {
      return getDictDatas(this.dictType)
    }
  },
  methods: {
    handleChange(val) {
      this.$emit('change', val)
    }
  }
}
</script>
