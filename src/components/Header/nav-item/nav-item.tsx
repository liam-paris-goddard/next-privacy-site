/*import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'nav-item',
  styleUrl: 'nav-item.scss',
  shadow: true
})
export class NavItem {
  @Prop() item: any;
  @Prop() showMegaNav: boolean;
  @Prop() index: number;

  render() {
    return (
      <li class={`nav-item${this.showMegaNav ? ' dropdown gsi-mega-dropdown' : ''}${this.item.isActive ? ' nav-item--is_active' : ''}`}>
        <a href={this.item.link} class="nav-link" target={`${this.item.target}`}>
          {this.item.thumbnailImage && <img class="nav-link-icon" src={`${this.item.thumbnailImage.src}`} alt={`${this.item.thumbnailImage.alt}`} />}
          {this.item.navIcon && <img class="nav-link-icon" src="/etc.clientlibs/gsi/clientlibs/clientlib-site/resources/images/icon-arrow-right-dark-blue.svg" alt="${this.item.page.title @ context='attribute'}"></img>}
          <span>{this.item.title}</span>
          {this.showMegaNav && <dropdown-menu item={this.item} index={this.index}></dropdown-menu>}
        </a>
      </li>
    );
  }
}
*/