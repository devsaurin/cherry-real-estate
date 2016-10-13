<?php
/**
 * Related Properties.
 *
 * This template can be overridden by copying it to yourtheme/real-estate/single-property/related.php
 *
 * @package    Cherry_Real_Estate
 * @subpackage Templates
 * @author     Template Monster
 * @license    GPL-3.0+
 * @copyright  2002-2016, Template Monster
 */

$heading = esc_html( apply_filters(
	'cherry_re_property_related_heading',
	esc_html__( 'Related Properties', 'cherry-real-estate' )
) );

$data = Cherry_RE_Property_Data::get_instance();

$meta_key   = cherry_real_estate()->get_meta_prefix() . 'status';
$meta_query = array(
	array(
		'key'     => $meta_key,
		'value'   => get_post_meta( get_the_ID(), $meta_key, true ),
		'compare' => '=',
	),
);

$query_args = apply_filters( 'cherry_re_property_related_args', array(
	'post__not_in'        => array( get_the_ID() ),
	'meta_query'          => $meta_query,
	'ignore_sticky_posts' => true,
	'number'              => 3,
	'echo'                => false,
	'item_class'          => 'tm-property-related__item',
	'author'              => get_the_author_meta( 'ID' ),
	'css_class'           => 'tm-property-related__wrap tm-property__wrap--related',
	'template'            => 'related.tmpl',
) );

$related = $data->the_property( $query_args );

if ( ! $related ) {
	return;
} ?>

<div class="tm-property-related">

	<?php if ( $heading ) : ?>
		<h2 class="tm-property-related__title tm-property__subtitle"><?php echo $heading; ?></h2>
	<?php endif; ?>

	<?php echo $related; ?>

</div>
