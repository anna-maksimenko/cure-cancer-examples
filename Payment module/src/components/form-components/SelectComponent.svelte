<script>
    // Tried to build own component, but abandoned due to svelte-select(https://github.com/rob-balfre/svelte-select)
    import { createEventDispatcher } from 'svelte';

    export let placeholder = "Search..."
    export let listItems = [{id:0, text:'No items'}]
    export let selectedItem = listItems[0]
    export let searchable = false
    export let selectedValue = '';
    export let selectCallback;
    export let name;

    const dispatch = createEventDispatcher();

    let searchValue = ''
    let dropDownOpen = false;
    $: listToShow = (searchable) ? filterList(listItems, searchValue) : listItems

    function filterList(list, value){
        if(value){
            return list.filter((item)=>{
                if(item.text.toLowerCase().indexOf(value.toLowerCase()) > -1){
                    return true
                }
            })
        } else {
            return list
        }
        
    }
    function selectItem(selected){
        listItems.map((item) => {
            if(item = selected){
                selectedItem = item
            }
        })
        closeDropdown();
        selectedValue = selected
        dispatch('value-selected');        
    }
    function toggleDropdown(){
        dropDownOpen = !dropDownOpen
    }
    function closeDropdown(){
        dropDownOpen = false
    }
</script>

<style lang="less">
    .dropdown-element{
        display: block;
        position: relative;
        cursor: pointer;
        padding: 0;
        background-color: @secondaryColor;
        &:before{
            content: "";
            border-color: #888 transparent transparent transparent;
            border-style: solid;
            border-width: 5px 4px 0 4px;
            height: 0;
            right: 20px;
            margin-left: -4px;
            margin-top: -2px;
            position: absolute;
            top: 50%;
            width: 0;
            transition: transform 0.2s;
        }
        .dropdown-label{
            display: flex;
            align-items: center;
            height: 2.8125rem;
            color: @fontColor;
            font-family: @dropdownFontFamily;
            font-size: 22px;
            line-height: 2.8125rem;
            padding-left: 9px;
            text-align: left;
            padding-right: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            border: 1px solid @amountInputBorderColor;
        }
        .dropdown-cont{
            position: absolute;
            left: 0;
            width: 100%;
            top: 100%;
            max-height: 300px;
            background-color: @secondaryColor;
            border: 1px solid lightgrey;
            word-wrap: break-word;
            white-space: wrap;
            box-sizing: border-box;
            margin-top: -1px;
            z-index: 999;
            .dropdown-list{
                padding: 0;
                margin: 0;
                .dropdown-item{
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    user-select: none;
                    -webkit-user-select: none;
                    .dropdown-item-inner{
                        display: flex;
                        align-items: center;
                        padding: 6px 9px;
                        height: 2.8125rem;
                        color: @fontColor;
                        font-family: @dropdownFontFamily;
                        font-size: 22px;
                        line-height: 2.8125rem;
                        text-align: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        box-sizing: border-box;
                    }
                }
            }
        }
        &.dropdown-open{
            &:before{
                transform: scale(1, -1);
            }
        }
    }
</style>

<div class={"dropdown-element" + ((dropDownOpen) ? ' dropdown-open' : '')} name={name}>
    <div class="dropdown-label" on:click={toggleDropdown}>
        <div class="dropdown-label-inner">
            <slot name="label-template">{selectedItem.text}</slot>
        </div>
    </div>
    {#if dropDownOpen}
        <div class="dropdown-cont">
            {#if searchable}
                <div class="dropdown-search">
                    <input value="{placeholder}" type="text" class="dropdown-search-input">
                </div>
            {/if}
            <ul class="dropdown-list">
                {#each listItems as item (item.id)}
                    <li class="dropdown-item" on:click={() => selectItem(item)}>
                        <div class="dropdown-item-inner">
                            <slot name="item-template">{item.text}</slot>
                        </div>                        
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>