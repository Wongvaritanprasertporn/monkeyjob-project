{* 
*
*
*}
{literal}
  <Style>
  {* add css here *}
  .same-all {
    display: flex;
    align-items: center;
  }
.sssssssssssss .select-data {
  border: 1px solid #f1f1f1;
  background: transparent !important;
  padding: 10px;
  border-radius: 5px;
}
.sssssssssssss .select-data .product-change {
  background: transparent;
  color: #fff;
  border: none;
}
.modal-title {
  color: #fff;
}


  </style>
{/literal}
<button type="button" class="select-data" data-toggle="modal" data-target="#myModal">
{if !empty($products_data)}
<select class="product-change">
{foreach from=$products_data item=product key=key name=name}
{if $product.id eq Tools::getValue('id_product')}
<option value="{$product.id}" selected="selected">{$product.name|truncate:30:"---"}</option>
{break}
{/if}
{/foreach}
</select>
{/if}
</button>

<!-- The Modal -->
<div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">{l s="Choose Style & Condition"}</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>

      <!-- Modal body -->
      <div class="modal-body">
        {if !empty($products_data)}
        <div class="row">
        {foreach from=$products_data item=product key=key name=name}
         <div class="same-all">
            <div class="col-md-2 img-responsive img-module"><a href="{$product.product_url}"><img src="https://{$product.image}" alt="{$product.name}"/></a></div>
            <div class="col-md-8 prod-title"><a href="{$product.product_url}">{$product.name}</a></div>
            <div class="col-md-2 prod-price">{Tools::displayPrice($product.price)}</div>
            <div class="clearfix"></div>
            </div>
        {/foreach}
        </div>
        {/if}
      </div>
    </div>
  </div>
</div>