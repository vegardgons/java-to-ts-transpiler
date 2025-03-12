public class Example {
    public static void main(String[] args) {

        int /* m */ a = 400;
        int /* km */ b = 2;
        int /* s */ c = 2000;
        int /* min */ d = 25;
        int /* h */ e = 1;
        int f = 6;

        System.out.println(15 * 2 + f);
        System.out.println(a + b * 2);
        System.out.println(d - e);
        System.out.println(b / e);
        System.out.println(((a / c) * d + b * f));

        // Illegal operations below
        // Comment them out to test edge case handling

        // System.out.println(a + c);
        // System.out.println(c * d);
        // System.out.println(e / b);

    }
}