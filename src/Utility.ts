class Utility {
    public static format(source: string, ...params: string[]): string {
        for (var i = 0; i < params.length; i++) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                return params[i];
            });
        }

        return source;
    }
}

export = Utility