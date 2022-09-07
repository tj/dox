declare module "dox" {
    export interface ParseCommentOptions {
        skipSingleStar?: boolean;
        skipPrefixes?: string[];
        raw?: boolean;
    }

    export interface CommentDescription {
        full: string;
        summary: string;
        body: string;
    }

    export interface Comment {
        /** array of tag objects */
        tags: Tag[];
        /** the first line of the comment */
        description: CommentDescription;
        /** true when "@api private" is used */
        isPrivate: boolean;
        isConstructor: boolean;
        line: number;
        /** lines following the description */
        body: any;
        /** both the description and the body */
        content: any;
        codeStart: number;
        code: string;
        ctx: ContextPatternMatchersCtx;
        ignore: boolean;
    }

    export interface Tag {
        string: string;
        /** from "@param"/"@property"/"@template", name of parameter/property */
        name?: string;
        /** text after various tags */
        description?: string;
        /** from "@see", everything before "http" */
        title?: string;
        /** from "@see" */
        url?: string;
        /** from "@see" */
        local?: string;
        /** when "@api private" this field will be "private" (what is after "@api") and in case of "@protected"/"@public"/"@private" will be the tag itself */
        visibility?: string;
        /** the string after "@memberOf"/"@lends" */
        parent?: string;
        /** the string after "@extends"/"@implements"/"@augments" */
        otherClass?: string;
        /** from "@borrows" */
        otherMemberName?: string;
        /** from "@borrows" */
        thisMemberName?: string;
        /** all parsed types from tags that support it, like "@param" */
        types?: string[];
        /** from "@description" */
        full?: string;
        /** from "@description" */
        summary?: string;
        /** from "@description" */
        body?: string;
        typesDescription?: string;
        /** 
         * "true" when the property is marked optional
         * @example
         * @param {string} [optionalProperty]
         * @param {string} nonOptionalProperty
         */
        optional?: boolean;
        /** 
         * "true" when the property is marked nullable 
         * @example
         * @param {?string} nullable
         * @param {string} normal
         * @param {!string} nonNullable
         */
        nullable?: boolean;
        /** 
         * "true" when the property is marked non-nullable
         * @example
         * @param {?string} nullable
         * @param {string} normal
         * @param {!string} nonNullable
         */
        nonNullable?: boolean;
        /**
         * "true" when using the spread type
         * @example
         * @param {...string} spread
         * @param {string} nonSpread
         */
        variable?: boolean;
    }

    export function api(comments: Comment[]): string;
    /** Parse comments in the given string of `js`. */
    export function parseComments(js: string, options: ParseCommentOptions): Comment[];
    /** Removes excess indentation from string of code. */
    export function trimIndentation(str: string): string;
    /**
     * Parse the given comment `str`.
     *
     * The comment object returned contains the following
     */
    export function parseComment(str: string, options: ParseCommentOptions): any;
    /**
     * Extracts different parts of a tag by splitting string into pieces separated by whitespace. If the white spaces are
     * somewhere between curly braces (which is used to indicate param/return type in JSDoc) they will not be used to split
     * the string. This allows to specify jsdoc tags without the need to eliminate all white spaces i.e. {number | string}
     */
    export function extractTagParts(str: any): string[];
    /** Parse tag string "@param {Array} name description" etc. */
    export function parseTag(str: any): Tag;
    /**
     * Parse tag type string "{Array|Object}" etc.
     * This function also supports complex type descriptors like in jsDoc or even the enhanced syntax used by the
     * [google closure compiler](https://developers.google.com/closure/compiler/docs/js-for-compiler#types)
     *
     * The resulting array from the type descriptor `{number|string|{name:string,age:number|date}}` would look like this:
     */
    export function parseTagTypes(str: string, tag: Tag): string[];
    /**
     * Determine if a parameter is optional.
     *
     * Examples:
     * JSDoc: {Type} [name]
     * Google: {Type=} name
     * TypeScript: {Type?} name
     */
    export function parseParamOptional(tag: Tag): boolean;
    /**
     * Parse the context from the given `str` of js.
     *
     * This method attempts to discover the context
     * for the comment based on it's code. Currently
     * supports:
     *
     *   - classes
     *   - class constructors
     *   - class methods
     *   - function statements
     *   - function expressions
     *   - prototype methods
     *   - prototype properties
     *   - methods
     *   - properties
     *   - declarations
     */
    export function parseCodeContext(str: string, parentContext?: any | undefined): any;

    export interface ContextPatternMatchersCtx {
        type: 'class' | 'constructor' | 'method' | 'function' | 'property' | 'prototype' | 'declaration';
        constructor?: string;
        cons?: string;
        name: string;
        string: string;
        extends?: string;
        value?: string;
    }

    export type ContextPatternMatchersFn = (str: string, parentContext?: ContextPatternMatchersCtx) => ContextPatternMatchersCtx;

    export let contextPatternMatchers: ContextPatternMatchersFn[];
}
