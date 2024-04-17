import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dropdown-menu',
  styleUrl: 'dropdown-menu.css',
  shadow: true
})
export class DropdownMenu {
  @Prop() item: any;
  @Prop() index: number;

  render() {
    return (
      <div>
        <button type="button" id={`navDropdown-${this.index}`} class="gsi-mega-dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="sr-only">Toggle dropdown menu</span>
        </button>
        <div class="dropdown-menu gsi-mega-dropdown-menu" aria-labelledby={`navDropdown-${this.index}`}>
          <div class="container-xxl gsi-menu-teaser-container">
            <div class="row">
              <div class="gsi-menu-teaser col">
                <div class="card">
                  <img class="card-img-top" src={this.item.megaNavImage} alt={this.item.megaNavImageAlt} />
                  <div class="card-body">
                    <p class="card-text">{this.item.megaNavDesc}</p>
                    <a href={this.item.megaNavLinkUrl} class="btn btn-primary">{this.item.megaNavLinkText}</a>
                  </div>
                </div>
              </div>
              <menu-links item={this.item}></menu-links>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
