<template>
    <AdminLayout>
        <PageBreadcrumb :pageTitle="currentPageTitle" />
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="space-y-6">
                <ComponentCard :title="$t('product.basicInfo')">
                    <div class="space-y-6">
                        <!-- Text Input -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('product.productName') }}
                            </label>
                            <input type="text" :placeholder="$t('product.productName')" v-model="formData.input"
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        </div>

                        <!-- Select Input -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('product.productCategory') }}
                            </label>
                            <div class="relative z-20 bg-transparent">
                                <select v-model="formData.selectInput"
                                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    :class="{ 'text-gray-800 dark:text-white/90': formData.selectInput }">
                                    <option value="" disabled selected>Select Option</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="template">Template</option>
                                    <option value="development">Development</option>
                                </select>
                                <span
                                    class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
                                    <ChevronDownIcon class="stroke-current" width="20" height="20" />
                                </span>
                            </div>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('product.productDescription') }}
                            </label>
                            <QuillEditor :style="'height:300px'" ref="quillRef" :modules="modules" toolbar="full" />
                        </div>

                    </div>
                </ComponentCard>
                <ComponentCard title="Select Inputs">
                    <div class="space-y-6">
                        <!-- Single Select Input using Select -->
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Select Input
                            </label>
                            <div class="">
                                <Select v-model="singleSelect" :options="options"
                                    :buttonClass="'h-11 w-full text-left px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'"
                                    placeholder="Select Option" />
                            </div>
                        </div>

                        <!-- Multiple Select Input -->
                        <div>
                            <MultipleSelect v-model="selectedItems" :options="options" class="w-full"
                                label="Multi select" />
                        </div>
                    </div>
                </ComponentCard>
                <ComponentCard title="Inputs States">
                    <TextArea />
                </ComponentCard>
                <ComponentCard title="Inputs States">
                    <InputState />
                </ComponentCard>
            </div>
            <div class="space-y-6">
                <ComponentCard title="Inputs Group">
                    <div class="space-y-6">
                        <div class="product-variants-container space-y-6">
                            <div v-for="(productVariant, variantIndex) in product.productVariants" :key="variantIndex">
                                <div class="space-y-3">
                                    <div>
                                        <label
                                            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 ">
                                            {{ $t('product.variant') }}
                                        </label>
                                        <input type="text" :placeholder="$t('product.fill')"
                                            v-model="productVariant.name"
                                            class="w-full dark:bg-dark-900 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                    </div>
                                    <div>
                                        <label
                                            class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                            {{ $t('product.option') }}
                                        </label>
                                        <div class="space-y-2">
                                            <div v-for="(option, optionIndex) in productVariant.options"
                                                :key="option.optionId">
                                                <input @input="onChangeVariantOption(variantIndex, optionIndex)"
                                                    type="text" :placeholder="$t('product.fill')" v-model="option.value"
                                                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button @click="onClickAddNewVariant" size="sm" variant="outline" :startIcon="PlusIcon"> {{
                            $t('product.addNewVariant') }}
                        </Button>
                        <div v-show="product.productVariants?.length > 0"
                            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                            <div class="max-w-full overflow-x-auto custom-scrollbar">
                                <table class="min-w-full">
                                    <thead>
                                        <tr class="border-b border-gray-200 dark:border-gray-700">
                                            <th v-for="(variant, variantIndex) in product.productVariants"
                                                class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    variant.name || $t('product.variantGroup') + ' ' + (variantIndex +
                                                        1)
                                                }}</p>
                                            </th>
                                            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    $t('product.price')
                                                }}</p>
                                            </th>
                                            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    $t('product.inventory') }}
                                                </p>
                                            </th>
                                            <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                                                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                                                    $t('product.sku') }}</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="productSku in product.productSkus" :key="productSku.id"
                                            class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">

                                            <!-- Full Name -->
                                            <td v-for="(variant, variantIndex) in product.productVariants"
                                                class="px-5 py-4 sm:px-6">
                                                <div class="text-sm text-gray-900 dark:text-white">{{
                                                    getVariantValueBySKU(productSku, variant) }}
                                                </div>
                                            </td>

                                            <!-- Status -->
                                            <td class="px-5 py-4 sm:px-6">

                                            </td>

                                            <!-- Is System Admin -->
                                            <td class="px-5 py-4 sm:px-6" v-if="currentUser?.isSystemAdmin()">

                                            </td>





                                            <!-- Last Updated Date -->
                                            <td class="px-5 py-4 sm:px-6">
                                                <div class="text-sm text-gray-900 dark:text-white">{{
                                                    admin?.lastUpdatedDate
                                                }}</div>
                                            </td>

                                            <!-- Actions -->

                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>


                        <div>
                            <Input v-model="email" :label="$t('product.price')" :placeholder="$t('product.typeHere')"
                                :inputClass="'pl-[62px]'">
                            <template #prepend>
                                <span
                                    class="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                    <MailIcon />
                                </span>
                            </template>
                            </Input>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                {{ $t('product.inventory') }}
                            </label>
                            <input type="text" :placeholder="$t('product.typeHere')" v-model="formData.input"
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        </div>
                    </div>
                </ComponentCard>
                <ComponentCard title="File Input">
                    <FileInput />
                </ComponentCard>
                <ComponentCard title="Check box">
                    <CheckboxInput />
                </ComponentCard>
                <ComponentCard title="Radio Buttons">
                    <RadioGroups />
                </ComponentCard>
                <ComponentCard title="Toggle Switch">
                    <ToggleSwitches />
                </ComponentCard>
                <ComponentCard title="Dropzone">
                    <Dropzone />
                </ComponentCard>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import DefaultInputs from '@/views/Demo/Forms/DefaultInputs.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import SelectInput from '@/views/Demo/Forms/SelectInput.vue';
import InputState from '@/views/Demo/Forms/InputState.vue';
import TextArea from '@/views/Demo/Forms/TextArea.vue';
import InputGroup from '@/views/Demo/Forms/InputGroup.vue';
import Dropzone from '@/components/common/Dropzone.vue';
import FileInput from '@/components/common/FileInput.vue';
import ToggleSwitches from '@/views/Demo/Forms/ToggleSwitches.vue';
import CheckboxInput from '@/views/Demo/Forms/CheckboxInput.vue';
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader';
import MultipleSelect from '@/components/common/MultipleSelect.vue'
import Select from '@/components/common/Select.vue'
import Input from '@/components/common/Input.vue'
import MailIcon from '@/icons/MailIcon.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'
import CopyIcon from '@/icons/CopyIcon.vue'
import Button from '@/components/common/Button.vue';
import { PlusIcon } from '@/icons';
import _ from 'lodash';

const currentPageTitle = ref('Form Elements');
const formData = ref({})
const product = ref({
    productVariants: [],
    productSkus: []
})
const quillRef = ref(null)

const modules = ref({
    name: 'imageUploader',
    module: ImageUploader,
    options: {
        upload: file => {
            return new Promise(() => {
                const formData = new FormData();
                formData.append("image", file);

                // axios.post('/upload-image', formData)
                //   .then(res => {
                //     console.log(res)
                //     resolve(res.data.url);
                //   })
                //   .catch(err => {
                //     reject("Upload failed");
                //     console.error("Error:", err)
                //   })
            })
        }
    }
})
const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
    { value: 'graphs', label: 'Graphs' },
]

const onClickAddNewVariant = () => {
    const defaultVariantValue = {
        id: (product.value.productVariants?.length ?? 0) + 1,
        name: "",
        options: [
            {
                optionId: 1,
                value: ''
            }
        ]
    }
    if (product.value.productVariants) {
        product.value.productVariants.push(defaultVariantValue)
    } else {
        product.value.productVariants = [defaultVariantValue]
    }
}
const onChangeVariantOption = (variantIndex, optionIndex) => {
    if (!product.value?.productVariants?.[variantIndex]?.options) return;

    // Add new empty option if needed
    if (optionIndex == product.value.productVariants[variantIndex].options.length - 1) {
        product.value.productVariants[variantIndex].options.push({
            optionId: optionIndex + 2, // Use optionIndex + 2 to avoid duplicate IDs
            value: ''
        });
    }

    const option = product.value.productVariants[variantIndex].options[optionIndex];
    const productVariant = product.value.productVariants[variantIndex];

    if (!option?.value) return;

    // Only generate new SKUs if this is a new option value
    handleAddSku(productVariant, option);
}

const handleAddSku = (productVariant, option) => {
    if (!product.value.productSkus) product.value.productSkus = [];

    // Get all variants with valid options
    const variantsForGeneration = product.value.productVariants.map(v => ({
        id: v.id,
        name: v.name,
        options: (v.id === productVariant.id
            ? [option] // Only use the current option for this variant
            : (v.options || []).filter(o => o?.value)) // Filter out empty options
    })).filter(v => (v.options || []).length > 0);

    // Generate all possible combinations
    const combinations = generateSkus(variantsForGeneration);

    // Track existing combinations to avoid duplicates
    const existingKeys = new Set((product.value.productSkus || []).map(sku =>
        buildCombinationKey(sku.skuVariants || [])
    ));

    // Add only new combinations
    combinations.forEach(combo => {
        const key = buildCombinationKey(combo);
        if (!existingKeys.has(key)) {
            product.value.productSkus.push({
                id: (product.value.productSkus.length || 0) + 1,
                price: 0,
                quantity: 0,
                skuNo: '',
                skuVariants: combo
            });
            existingKeys.add(key);
        }
    });
}

const buildCombinationKey = (combo) => {
    return (combo || [])
        .map(i => `${i.variantId}:${i.value}`)
        .sort()
        .join('|');
}

const generateSkus = (variants) => {
    if (!variants || variants.length === 0) return [];

    const toPairs = (variant) => (variant.options || [])
        .filter(o => o?.value)
        .map(o => ({
            variantId: variant.id,
            variantName: variant.name,
            optionId: o.optionId,
            value: o.value
        }));

    let result = [[]];
    for (const variant of variants) {
        const pairs = toPairs(variant);
        if (pairs.length === 0) continue;

        const next = [];
        for (const acc of result) {
            for (const p of pairs) {
                // Check if this combination already contains this variant
                const hasVariant = acc.some(item => item.variantId === p.variantId);

                // Only add if this variant isn't already in the combination
                if (!hasVariant) {
                    next.push([...acc, p]);
                }
            }
        }
        result = next;
    }
    return result;
}

const getVariantValueBySKU = (productSku, variant) => {
    if (!productSku || !Array.isArray(productSku.skuVariants) || !variant) return '';
    const variantId = variant.id;
    const variantName = (variant.name || '').toString().trim();
    const matched = productSku.skuVariants.find(sv =>
        (variantId !== undefined && sv.variantId === variantId) ||
        (variantName && sv.variantName === variantName)
    );
    return matched?.value || '';
}
</script>
<style scoped>
:deep(.ql-toolbar.ql-snow) {
    margin-bottom: 0px;
}
</style>